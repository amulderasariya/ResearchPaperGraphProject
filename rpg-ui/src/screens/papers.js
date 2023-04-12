import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import Graph from '../components/graph';
import { GET_PAPER_DATA, SEARCH_PAPERS } from '../utils/queries';

export default function Paper() {
  const [searchKeyWord, setSearchKeyword] = useState('');
  const [searchGraphKeyword, setSearchGraphKey] = useState('');
  const searchQuery = useQuery(SEARCH_PAPERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      where: {
        title_CONTAINS: searchKeyWord,
      },
      options: {
        limit: 10,
      },
    },
  });
  const graphQuery = useQuery(GET_PAPER_DATA, {
    fetchPolicy: 'cache-and-network',
    variables: {
      where: {
        title_CONTAINS: searchGraphKeyword,
      },
      options: {
        limit: 5,
      },
    },
  });

  return (
    <Box>
      <Grid container sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <Grid flex={7}>
          <Autocomplete
            onChange={(e, value) => {
              setSearchKeyword(value && value.label);
            }}
            id="combo-box-demo"
            options={
              searchQuery.data
                ? searchQuery.data.papers.map((paper) => ({ label: paper.title, id: paper.id }))
                : []
            }
            sx={{ margin: '2em', width: 'calc(100% - 4em)' }}
            renderInput={(params) => (
              <TextField
                {...params}
                value={searchKeyWord}
                id="outlined-basic"
                label="Search"
                variant="outlined"
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  searchQuery.refetch();
                }}
              />
            )}
          />
        </Grid>
        <Grid flex={1}>
          <Button
            onClick={() => {
              graphQuery.refetch();
              setSearchGraphKey(searchKeyWord);
            }}
            variant="contained"
          >
            <Typography>Search</Typography>
          </Button>
        </Grid>
      </Grid>
      <Graph graphQuery={graphQuery} type="fCoSE" />
    </Box>
  );
}
