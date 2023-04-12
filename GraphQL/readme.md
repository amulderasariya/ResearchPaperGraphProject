# Steps

<ol>
    <li>
    npm install
    </li>
    <li>
    npm start
    </li>
    <li>
        Sample Query: query {
            papers(options: {limit: 5}) {
                id
                title
                year {
                year
                }
                authors {
                id
                name
                org
                }
                fieldOfStudy {
                name
                weight
                }
            }
        }
    </li>
</ol>
