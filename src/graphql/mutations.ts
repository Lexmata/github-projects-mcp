// GraphQL Mutations for GitHub Projects V2

export const CREATE_PROJECT = `
  mutation CreateProject($input: CreateProjectV2Input!) {
    createProjectV2(input: $input) {
      projectV2 {
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

export const UPDATE_PROJECT = `
  mutation UpdateProject($input: UpdateProjectV2Input!) {
    updateProjectV2(input: $input) {
      projectV2 {
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

export const DELETE_PROJECT = `
  mutation DeleteProject($input: DeleteProjectV2Input!) {
    deleteProjectV2(input: $input) {
      projectV2 {
        id
      }
    }
  }
`;

export const ADD_DRAFT_ISSUE = `
  mutation AddDraftIssue($input: AddProjectV2DraftIssueInput!) {
    addProjectV2DraftIssue(input: $input) {
      projectItem {
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

export const ADD_ITEM_BY_ID = `
  mutation AddItemById($input: AddProjectV2ItemByIdInput!) {
    addProjectV2ItemById(input: $input) {
      item {
        id
        type
        createdAt
        updatedAt
        isArchived
        content {
          __typename
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

export const UPDATE_ITEM_FIELD_VALUE = `
  mutation UpdateItemFieldValue($input: UpdateProjectV2ItemFieldValueInput!) {
    updateProjectV2ItemFieldValue(input: $input) {
      projectV2Item {
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

export const DELETE_ITEM = `
  mutation DeleteItem($input: DeleteProjectV2ItemInput!) {
    deleteProjectV2Item(input: $input) {
      deletedItemId
    }
  }
`;

export const CREATE_FIELD = `
  mutation CreateField($input: CreateProjectV2FieldInput!) {
    createProjectV2Field(input: $input) {
      projectV2Field {
        __typename
        ... on ProjectV2Field {
          id
          name
          dataType
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
    }
  }
`;

export const UPDATE_FIELD = `
  mutation UpdateField($input: UpdateProjectV2FieldInput!) {
    updateProjectV2Field(input: $input) {
      projectV2Field {
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
    }
  }
`;

export const DELETE_FIELD = `
  mutation DeleteField($input: DeleteProjectV2FieldInput!) {
    deleteProjectV2Field(input: $input) {
      projectV2Field {
        __typename
        ... on ProjectV2Field {
          id
        }
        ... on ProjectV2IterationField {
          id
        }
        ... on ProjectV2SingleSelectField {
          id
        }
      }
    }
  }
`;
