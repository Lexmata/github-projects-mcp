// GraphQL Queries for GitHub Projects V2

export const GET_USER_PROJECTS = `
  query GetUserProjects($login: String!, $first: Int!, $after: String) {
    user(login: $login) {
      projectsV2(first: $first, after: $after) {
        nodes {
          id
          number
          title
          shortDescription
          public
          closed
          closedAt
          createdAt
          updatedAt
          url
          readme
          owner {
            __typename
            ... on User {
              login
              id
            }
            ... on Organization {
              login
              id
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`;

export const GET_ORG_PROJECTS = `
  query GetOrgProjects($login: String!, $first: Int!, $after: String) {
    organization(login: $login) {
      projectsV2(first: $first, after: $after) {
        nodes {
          id
          number
          title
          shortDescription
          public
          closed
          closedAt
          createdAt
          updatedAt
          url
          readme
          owner {
            __typename
            ... on User {
              login
              id
            }
            ... on Organization {
              login
              id
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`;

export const GET_USER_PROJECT = `
  query GetUserProject($login: String!, $number: Int!) {
    user(login: $login) {
      projectV2(number: $number) {
        id
        number
        title
        shortDescription
        public
        closed
        closedAt
        createdAt
        updatedAt
        url
        readme
        owner {
          __typename
          ... on User {
            login
            id
          }
          ... on Organization {
            login
            id
          }
        }
      }
    }
  }
`;

export const GET_ORG_PROJECT = `
  query GetOrgProject($login: String!, $number: Int!) {
    organization(login: $login) {
      projectV2(number: $number) {
        id
        number
        title
        shortDescription
        public
        closed
        closedAt
        createdAt
        updatedAt
        url
        readme
        owner {
          __typename
          ... on User {
            login
            id
          }
          ... on Organization {
            login
            id
          }
        }
      }
    }
  }
`;

export const GET_USER_ID = `
  query GetUserId($login: String!) {
    user(login: $login) {
      id
    }
  }
`;

export const GET_ORG_ID = `
  query GetOrgId($login: String!) {
    organization(login: $login) {
      id
    }
  }
`;

export const GET_PROJECT_ITEMS = `
  query GetProjectItems($projectId: ID!, $first: Int!, $after: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(first: $first, after: $after) {
          nodes {
            id
            type
            createdAt
            updatedAt
            isArchived
            content {
              __typename
              ... on DraftIssue {
                title
                body
                createdAt
                updatedAt
              }
              ... on Issue {
                id
                number
                title
                body
                state
                url
                createdAt
                updatedAt
                repository {
                  name
                  owner {
                    login
                  }
                }
              }
              ... on PullRequest {
                id
                number
                title
                body
                state
                url
                createdAt
                updatedAt
                repository {
                  name
                  owner {
                    login
                  }
                }
              }
            }
            fieldValues(first: 50) {
              nodes {
                __typename
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field {
                    ... on ProjectV2Field {
                      id
                      name
                      dataType
                    }
                  }
                }
                ... on ProjectV2ItemFieldNumberValue {
                  number
                  field {
                    ... on ProjectV2Field {
                      id
                      name
                      dataType
                    }
                  }
                }
                ... on ProjectV2ItemFieldDateValue {
                  date
                  field {
                    ... on ProjectV2Field {
                      id
                      name
                      dataType
                    }
                  }
                }
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  optionId
                  field {
                    ... on ProjectV2SingleSelectField {
                      id
                      name
                      dataType
                    }
                  }
                }
                ... on ProjectV2ItemFieldIterationValue {
                  title
                  iterationId
                  startDate
                  duration
                  field {
                    ... on ProjectV2IterationField {
                      id
                      name
                      dataType
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              totalCount
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    }
  }
`;

export const GET_PROJECT_ITEM = `
  query GetProjectItem($itemId: ID!) {
    node(id: $itemId) {
      ... on ProjectV2Item {
        id
        type
        createdAt
        updatedAt
        isArchived
        content {
          __typename
          ... on DraftIssue {
            title
            body
            createdAt
            updatedAt
          }
          ... on Issue {
            id
            number
            title
            body
            state
            url
            createdAt
            updatedAt
            repository {
              name
              owner {
                login
              }
            }
          }
          ... on PullRequest {
            id
            number
            title
            body
            state
            url
            createdAt
            updatedAt
            repository {
              name
              owner {
                login
              }
            }
          }
        }
        fieldValues(first: 50) {
          nodes {
            __typename
            ... on ProjectV2ItemFieldTextValue {
              text
              field {
                ... on ProjectV2Field {
                  id
                  name
                  dataType
                }
              }
            }
            ... on ProjectV2ItemFieldNumberValue {
              number
              field {
                ... on ProjectV2Field {
                  id
                  name
                  dataType
                }
              }
            }
            ... on ProjectV2ItemFieldDateValue {
              date
              field {
                ... on ProjectV2Field {
                  id
                  name
                  dataType
                }
              }
            }
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              optionId
              field {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  dataType
                }
              }
            }
            ... on ProjectV2ItemFieldIterationValue {
              title
              iterationId
              startDate
              duration
              field {
                ... on ProjectV2IterationField {
                  id
                  name
                  dataType
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    }
  }
`;

export const GET_PROJECT_FIELDS = `
  query GetProjectFields($projectId: ID!, $first: Int!, $after: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        fields(first: $first, after: $after) {
          nodes {
            __typename
            ... on ProjectV2Field {
              id
              name
              dataType
            }
            ... on ProjectV2IterationField {
              id
              name
              dataType
              configuration {
                iterations {
                  id
                  title
                  startDate
                  duration
                }
                completedIterations {
                  id
                  title
                  startDate
                  duration
                }
                duration
                startDay
              }
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              dataType
              options {
                id
                name
                color
                description
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    }
  }
`;

export const GET_PROJECT_VIEWS = `
  query GetProjectViews($projectId: ID!, $first: Int!, $after: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        views(first: $first, after: $after) {
          nodes {
            id
            name
            number
            layout
            filter
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    }
  }
`;

export const GET_PROJECT_VIEW = `
  query GetProjectView($projectId: ID!, $viewNumber: Int!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        view(number: $viewNumber) {
          id
          name
          number
          layout
          filter
        }
      }
    }
  }
`;
