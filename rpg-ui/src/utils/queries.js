import { gql } from '@apollo/client';

export const SEARCH_PAPERS = gql`
  query ($where: PaperWhere, $options: PaperOptions) {
    papers(where: $where, options: $options) {
      id
      title
    }
  }
`;

export const SEARCH_FOS = gql`
  query fos($options: FIELD_OF_STUDYOptions, $where: FIELD_OF_STUDYWhere) {
    fieldOfStudies(options: $options, where: $where) {
      name
    }
  }
`;
export const GET_FOS_EVOLUTION = gql`
  query fos(
    $options: FIELD_OF_STUDYOptions
    $where: FIELD_OF_STUDYWhere
    $papersOptions: PaperOptions
  ) {
    fieldOfStudies(options: $options, where: $where) {
      name
      papers(options: $papersOptions) {
        id
        title
        cites(options: $papersOptions) {
          id
          title
          cites(options: $papersOptions) {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_PAPER_DATA = gql`
  query ($where: PaperWhere, $options: PaperOptions) {
    papers(options: $options, where: $where) {
      id
      title
      __typename
      publishedOn {
        year
        __typename
      }
      authoredBy {
        id
        name
        __typename
      }
      fromFos {
        name
        __typename
      }
      cites {
        id
        title
      }
    }
  }
`;
