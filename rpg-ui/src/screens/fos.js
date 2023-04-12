import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import Graph from '../components/graph';
import { GET_FOS_EVOLUTION, SEARCH_FOS } from '../utils/queries';

export default function Fos() {
  const [searchKeyWord, setSearchKeyword] = useState('');
  const [searchGraphKeyword, setSearchGraphKey] = useState('');
  const searchQuery = useQuery(SEARCH_FOS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      options: {
        limit: 10,
      },
      where: {
        name_CONTAINS: searchKeyWord,
      },
    },
  });
  const graphQuery = useQuery(GET_FOS_EVOLUTION, {
    fetchPolicy: 'cache-and-network',
    variables: {
      options: {
        limit: 1,
      },
      papersOptions: {
        limit: 5,
      },
      where: {
        name_CONTAINS: searchGraphKeyword,
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
                ? searchQuery.data.fieldOfStudies.map((fos) => ({
                    label: fos.name,
                    id: fos.name,
                  }))
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
      <Graph graphQuery={graphQuery} type="darge" />
    </Box>
  );
}
