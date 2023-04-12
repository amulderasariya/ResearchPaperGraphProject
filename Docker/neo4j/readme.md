# Steps

```sh
# Docker Build from dockerfile (should be executed from the same folder where docker file is located)
    docker build -t cs554/neo4j .
# Docker run (slow on mac "apple" chips)
    docker run -d \
        --restart always \
        --env NEO4J_AUTH=neo4j/helloworld \
        -v $PWD/data:/data \
        -p 7474:7474 -p 7687:7687 \
        --name web2-project-RPG-database \
        cs554/neo4j
```
