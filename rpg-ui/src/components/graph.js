import React from 'react';
import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import FCoSE from 'cytoscape-fcose';
import CytoscapeComponent from 'react-cytoscapejs';
import klay from 'cytoscape-klay';
import { convertDataToGraph, defaultStylesheet, nodeTypes } from '../utils/graphUtils';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import NotFound from './error-page';
import popper from 'cytoscape-popper';
Cytoscape.use(popper);

const layoutTypes = {
  darge: { name: 'dagre', step: 'all', animationEasing: 'ease-out' },
  fCoSE: { name: 'fcose', step: 'all', animationEasing: 'ease-out' },
  klay: { name: 'klay', step: 'all', animationEasing: 'ease-out' },
};

function Graph({ type, graphQuery }) {
  if (graphQuery.loading) {
    return (
      <Box
        sx={{
          height: '70vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (graphQuery.error) {
    return <NotFound />;
  }
  switch (type) {
    case 'darge':
      Cytoscape.use(dagre);
      break;
    case 'fCoSE':
      Cytoscape.use(FCoSE);
      break;
    case 'klay':
      Cytoscape.use(klay);
      break;
    default:
      Cytoscape.use(FCoSE);
      type = 'fCoSE';
  }
  const layout = layoutTypes[type];
  let elements;
  if (graphQuery.data) {
    elements = convertDataToGraph(graphQuery.data);
  } else {
    elements = [];
  }
  const setListeners = (cy) => {
    const tips = document.createElement('div');
    cy.nodes().on('mouseover', (event) => {
      let target = event.target;
      target.popperref = event.target.popper({
        content: () => {
          tips.innerHTML = event.target.data('label');
          tips.className = 'tooltipstyles';
          document.body.appendChild(tips);
          return tips;
        },
        popper: {
          placement: 'top-start',
          removeOnDestroy: true,
        },
      });
    });
    cy.nodes().bind('mouseout', (_) => {
      document.body.removeChild(tips);
    });
  };

  return (
    <Box>
      <Box sx={{ position: 'absolute', right: '20px' }}>
        {Object.values(nodeTypes).map((nodeType) => (
          <Grid
            container
            sx={{
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <Grid
              sx={{
                borderRadius: 25,
                marginRight: 2,
                height: 25,
                width: 25,
                backgroundColor: nodeType.bgColor,
              }}
            />
            <Grid>
              <Typography variant="h6">{nodeType.type}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100vw', height: '80vh' }}
        layout={layout}
        stylesheet={defaultStylesheet}
        cy={(cy) => {
          setListeners(cy);
        }}
      />
    </Box>
  );
}

export default Graph;
