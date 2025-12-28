import type { GitHubGraphQLClient } from '../graphql/client.js';
import { CREATE_FIELD, DELETE_FIELD, UPDATE_FIELD } from '../graphql/mutations.js';
import { GET_PROJECT_FIELDS } from '../graphql/queries.js';
import type {
  CreateFieldInput,
  CreateFieldOutput,
  DeleteFieldInput,
  DeleteFieldOutput,
  ListProjectFieldsInput,
  ListProjectFieldsOutput,
  UpdateFieldInput,
  UpdateFieldOutput,
} from '../types/mcp.js';
import type {
  CreateProjectV2FieldPayload,
  DeleteProjectV2FieldPayload,
  ProjectV2FieldConfiguration,
  ProjectV2FieldConnection,
  UpdateProjectV2FieldPayload,
} from '../types/github.js';
import { GitHubProjectsError } from '../types/mcp.js';

interface ProjectFieldsResponse {
  node: {
    fields: ProjectV2FieldConnection;
  } | null;
}

interface CreateFieldResponse {
  createProjectV2Field: CreateProjectV2FieldPayload;
}

interface UpdateFieldResponse {
  updateProjectV2Field: UpdateProjectV2FieldPayload;
}

interface DeleteFieldResponse {
  deleteProjectV2Field: DeleteProjectV2FieldPayload;
}

export async function listProjectFields(
  client: GitHubGraphQLClient,
  input: ListProjectFieldsInput
): Promise<ListProjectFieldsOutput> {
  const { projectId, first = 50, after } = input;

  const response = await client.request<ProjectFieldsResponse>(GET_PROJECT_FIELDS, {
    projectId,
    first,
    after,
  });

  if (!response.node) {
    throw new GitHubProjectsError('PROJECT_NOT_FOUND', `Project ${projectId} not found`);
  }

  const { nodes, pageInfo, totalCount } = response.node.fields;

  return {
    fields: nodes as ProjectV2FieldConfiguration[],
    totalCount,
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

export async function createField(
  client: GitHubGraphQLClient,
  input: CreateFieldInput
): Promise<CreateFieldOutput> {
  const { projectId, name, dataType, singleSelectOptions } = input;

  const response = await client.request<CreateFieldResponse>(CREATE_FIELD, {
    input: {
      projectId,
      name,
      dataType,
      singleSelectOptions,
    },
  });

  if (!response.createProjectV2Field.projectV2Field) {
    throw new GitHubProjectsError('CREATE_FIELD_FAILED', 'Failed to create field');
  }

  return { field: response.createProjectV2Field.projectV2Field };
}

export async function updateField(
  client: GitHubGraphQLClient,
  input: UpdateFieldInput
): Promise<UpdateFieldOutput> {
  const { fieldId, name } = input;

  const response = await client.request<UpdateFieldResponse>(UPDATE_FIELD, {
    input: {
      fieldId,
      name,
    },
  });

  if (!response.updateProjectV2Field.projectV2Field) {
    throw new GitHubProjectsError('UPDATE_FIELD_FAILED', 'Failed to update field');
  }

  return { field: response.updateProjectV2Field.projectV2Field };
}

export async function deleteField(
  client: GitHubGraphQLClient,
  input: DeleteFieldInput
): Promise<DeleteFieldOutput> {
  const { fieldId } = input;

  const response = await client.request<DeleteFieldResponse>(DELETE_FIELD, {
    input: {
      fieldId,
    },
  });

  if (!response.deleteProjectV2Field.projectV2Field) {
    throw new GitHubProjectsError('DELETE_FIELD_FAILED', 'Failed to delete field');
  }

  return { deletedFieldId: response.deleteProjectV2Field.projectV2Field.id };
}
