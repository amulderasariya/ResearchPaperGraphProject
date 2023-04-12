export const nodeTypes = {
  Paper: {
    type: 'Paper',
    labelKey: 'title',
    idKey: 'id',
    bgColor: '#ECE2D0',
    relationshipTypes: [
      { label: 'Authored by', keyname: 'authoredBy' },
      { label: 'Published On', keyname: 'publishedOn' },
      { label: 'From Fos', keyname: 'fromFos' },
      { label: 'Cites', keyname: 'cites' },
    ],
  },
  Author: {
    type: 'Author',
    labelKey: 'name',
    idKey: 'id',
    bgColor: '#A26769',
    relationshipTypes: [],
  },
  FIELD_OF_STUDY: {
    type: 'Field of Study',
    labelKey: 'name',
    idKey: 'name',
    bgColor: '#ECF8F8',
    relationshipTypes: [{ label: 'Research', keyname: 'papers' }],
  },
  Year: {
    type: 'Year',
    labelKey: 'year',
    idKey: 'year',
    bgColor: '#D5B9B2',
    relationshipTypes: [],
  },
};
// Reduce all node types and relationships recursively.
const reduceNodesAndRelationships = (prev, curr) => {
  const currNodeType = nodeTypes[curr.__typename];
  prev.push({
    data: {
      id: curr[currNodeType.idKey],
      label: curr[currNodeType.labelKey],
      bgColor: currNodeType.bgColor,
    },
  });

  currNodeType.relationshipTypes.forEach((rel) => {
    if (Array.isArray(curr[rel.keyname])) {
      prev.push(...curr[rel.keyname].reduce(reduceNodesAndRelationships, []));
      const relationShips = curr[rel.keyname].map((relItem) => ({
        data: {
          source: curr[currNodeType.idKey],
          target: relItem[nodeTypes[relItem.__typename].idKey],
          label: rel.label,
        },
      }));
      prev.push(...relationShips);
    }
  });
  return prev;
};

export function convertDataToGraph(data) {
  const graphData = [];
  Object.keys(data).forEach((key) => {
    graphData.push(...data[key].reduce(reduceNodesAndRelationships, []));
  });
  return graphData;
}

export const defaultStylesheet = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '4px',
      'text-wrap': 'ellipsis',
      'text-max-width': '20px',
      'text-max-height': '2px',
      'text-overflow': 'ellipsis',
    },
  },
  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      'curve-style': 'bezier',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '5px',
      'text-wrap': 'wrap',
      'text-max-width': '20px',
      'text-max-height': '10px',
      'text-overflow': 'ellipsis',
    },
  },
  {
    selector: 'node',
    style: {
      'background-color': 'data(bgColor)',
      label: 'data(label)',
      'text-valign': 'center',
    },
  },

  {
    selector: ':parent',
    style: {
      //      'background-opacity': 0.333,
      'background-color': '#e8e8e8',
      'border-color': '#DADADA',
      //      'border-width': 3,
      'text-valign': 'bottom',
    },
  },

  {
    selector: 'edge',
    style: {
      'curve-style': 'straight',
      'line-color': '#bdd3d4',
    },
  },

  {
    selector: 'node:selected',
    style: {
      'background-color': '#33ff00',
      'border-color': '#22ee00',
    },
  },

  {
    selector: 'node.fixed',
    style: {
      shape: 'diamond',
      'background-color': '#9D9696',
    },
  },

  {
    selector: 'node.fixed:selected',
    style: {
      'background-color': '#33ff00',
    },
  },

  {
    selector: 'node.alignment',
    style: {
      shape: 'round-heptagon',
      'background-color': '#fef2d1',
    },
  },

  {
    selector: 'node.alignment:selected',
    style: {
      'background-color': '#33ff00',
    },
  },

  {
    selector: 'node.relative',
    style: {
      shape: 'rectangle',
      'background-color': '#fed3d1',
    },
  },

  {
    selector: 'node.relative:selected',
    style: {
      'background-color': '#33ff00',
    },
  },

  {
    selector: 'edge:selected',
    style: {
      'line-color': '#33ff00',
    },
  },
];
