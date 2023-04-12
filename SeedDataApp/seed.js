import { driver as _driver, auth } from 'neo4j-driver';

import {
  createWriteStream,
  existsSync,
  rmSync,
  mkdirSync,
  createReadStream,
  readdirSync,
} from 'fs';
import { parse } from 'JSONStream';

// Neo4j connection details
const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'helloworld';
const driver = _driver(uri, auth.basic(user, password));
// Download link --> https://www.kaggle.com/datasets/mathurinache/citation-network-dataset
const inputFilePath = 'dblp.v12.json';

// output file path pattern (e.g. 'output_1.json', 'output_2.json', etc.)
const neo4jImportFolder = 'neo4j/import';
const seedDataFilePattern = 'seed_batch_{}.json';
//Reduce batch size for slower machines
const batchSize = 5000;
let count = 0;
let fileCount = 1;

function createNewOutputFile() {
  const outputFilePath = neo4jImportFolder + seedDataFilePattern.replace('{}', fileCount);
  const outputStream = createWriteStream(outputFilePath, { flags: 'a' });
  outputStream.write('[');
  console.log(`Output file --> ${outputFilePath} created`);
  return outputStream;
}
// read the input file

async function parseInputData(session, inputFilePath) {
  try {
    await session.run(`
        CALL apoc.load.jsonArray("file:///${inputFilePath}") YIELD value
        UNWIND value AS paperData
        MERGE (y:Year {year: paperData.year})
        CREATE (p:Paper {id: paperData.id, title: paperData.title, doc_type: paperData.doc_type, publisher: paperData.publisher, doi: paperData.doi })
        CREATE (p)-[:PUBLISHED_ON]->(y)
        FOREACH(author IN paperData.authors |
            MERGE (a:Author {id: author.id})
            ON CREATE SET a.name = author.name, a.org = author.org
            CREATE (a)-[:AUTHORS]->(p)
        )
        FOREACH(fos IN paperData.fos |
            MERGE (f:FIELD_OF_STUDY {name: fos.name})
            ON CREATE SET f.weight = fos.w
            CREATE (p)-[:FOS {weight: fos.w}]->(f)
        )`);
  } catch (error) {
    console.error('error while importing batch file in neo4j');
    throw error;
  }
}
async function createPaperRelationsShip(session, inputFilePath) {
  try {
    await session.run(`CALL apoc.load.jsonArray("file:///${inputFilePath}") YIELD value
                      UNWIND value AS paperData
                      MATCH (p:Paper {id: paperData.id})
                      UNWIND paperData.references AS referenceId
                      MATCH (ref:Paper {id: referenceId})
                      CREATE (p)-[:CITES]->(ref)`);
  } catch (error) {
    console.error('Error while creating papaer relations');
    throw error;
  }
}
async function resetNeo4j(session) {
  try {
    await session.run(`CALL apoc.periodic.iterate("
    MATCH (n)
    RETURN n
", "
    DETACH DELETE n
", {batchSize: 1000})`);
    console.log('All nodes and relationships deleted successfully.');
    await session.run('DROP INDEX paper_index IF EXISTS');
    await session.run('DROP INDEX author_index IF EXISTS');
    await session.run('DROP INDEX fos_index IF EXISTS');
    console.log('Drop all index');
    await session.run('CREATE INDEX paper_index FOR (p:Paper) ON (p.id)');
    await session.run('CREATE INDEX author_index FOR (a:Author) ON (a.id)');
    await session.run('CREATE INDEX fos_index FOR (fos:FIELD_OF_STUDY) ON (fos.name)');
    console.log('Created new Index');
  } catch (error) {
    console.error('Error deleting all nodes and relationships:');
    throw error;
  }
}

function resetSeedDataFolder() {
  if (existsSync(neo4jImportFolder)) {
    rmSync(neo4jImportFolder, { recursive: true });
    console.log(`Removed existing ${neo4jImportFolder} folder`);
  }
  mkdirSync(neo4jImportFolder);
  console.log(`Created new ${neo4jImportFolder} folder`);
}

const splitData = () => {
  let outputStream = createNewOutputFile();
  createReadStream(inputFilePath)
    .pipe(parse('*'))
    .on('data', ({ id, title, authors, year, references, doc_type, publisher, doi, fos }) => {
      const json = JSON.stringify({
        id,
        title,
        authors,
        year,
        references,
        doc_type,
        publisher,
        doi,
        fos,
      });
      if (count > 0) {
        outputStream.write(',');
      }
      outputStream.write(json);
      count++;
      if (count === batchSize) {
        count = 0;
        outputStream.write(']');
        outputStream.end();
        fileCount++;
        outputStream = createNewOutputFile();
        // This doesn't work due to RAM limitations, this is 12 GB file
        // parseInputData(outputFilePathPattern.replace('{}', fileCount - 1));
      }
    })
    .on('end', () => {
      if (count > 0) {
        outputStream.write(']');
        outputStream.end();
      }
      loadAllFiles();
      console.log(`Finished pre-processing ${fileCount} output files.`);
    })
    .on('error', (err) => {
      console.error(`Error processing input file: ${err.message}`);
    });
};
const loadAllFiles = async () => {
  const session = driver.session();
  try {
    await resetNeo4j(session);
    console.log('Stating to insert paper to DB');
    const seedDatafiles = readdirSync(neo4jImportFolder);
    for (let i = 0; i < seedDatafiles.length; i++) {
      await parseInputData(session, seedDatafiles[i]);
      console.log(`Inserted ${(i + 1) * batchSize} papers and its authors to db`);
    }
    for (let i = 0; i < seedDatafiles.length; i++) {
      await createPaperRelationsShip(session, seedDatafiles[i]);
      console.log(`Inserted ${(i + 1) * batchSize} citation relationships db`);
    }
  } catch (error) {
    throw error;
  } finally {
    session.close();
    driver.close();
  }
};
const skipFileSplit = true;
async function main() {
  try {
    if (skipFileSplit) {
      fileCount = 10;
      loadAllFiles();
    } else {
      resetSeedDataFolder();
      splitData();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
