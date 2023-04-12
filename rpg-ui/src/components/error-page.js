import { Box } from '@mui/material';
import React from 'react';

export default function NotFound() {
  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        bgcolor: 'background.paper',
      }}
    >
      <h1>404 Not Found</h1>
      <p>Sorry, the page requested does not exist</p>
    </Box>
  );
}
