const { gql, ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const typeDefs = gql`
  type Paper {
    id: ID!
    title: String!
    doc_type: String
    publisher: String
    doi: String
    publishedOn: [Year!]! @relationship(type: "PUBLISHED_ON", direction: OUT)
    authoredBy: [Author!]! @relationship(type: "AUTHORS", direction: IN)
    fromFos: [FIELD_OF_STUDY!]! @relationship(type: "FOS", direction: OUT)
    cites: [Paper!]! @relationship(type: "CITES", direction: OUT)
  }

  type Year {
    year: Int!
    papers: [Paper!]! @relationship(type: "PUBLISHED_ON", direction: IN)
  }

  type Author {
    id: ID!
    name: String!
    org: String
    papers: [Paper!]! @relationship(type: "AUTHORS", direction: OUT)
  }

  type FIELD_OF_STUDY {
    name: String!
    weight: Float
    papers: [Paper!]! @relationship(type: "FOS", direction: IN)
  }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema: schema,
  });

  server.listen().then(({ url }) => {
    console.log(`GraphQL server ready on ${url}`);
  });
});
