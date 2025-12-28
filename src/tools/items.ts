import type { GitHubGraphQLClient } from '../graphql/client.js';
import {
  ADD_DRAFT_ISSUE,
  ADD_ITEM_BY_ID,
  DELETE_ITEM,
  UPDATE_ITEM_FIELD_VALUE,
} from '../graphql/mutations.js';
import { GET_PROJECT_ITEM, GET_PROJECT_ITEMS } from '../graphql/queries.js';
import type {
  AddDraftIssueInput,
  AddDraftIssueOutput,
  AddExistingIssueInput,
  AddExistingIssueOutput,
  GetProjectItemInput,
  GetProjectItemOutput,
  ListProjectItemsInput,
  ListProjectItemsOutput,
  RemoveProjectItemInput,
  RemoveProjectItemOutput,
  UpdateItemFieldInput,
  UpdateItemFieldOutput,
} from '../types/mcp.js';
import type {
  AddProjectV2DraftIssuePayload,
  AddProjectV2ItemByIdPayload,
  DeleteProjectV2ItemPayload,
  ProjectV2Item,
  ProjectV2ItemConnection,
  UpdateProjectV2ItemFieldValuePayload,
} from '../types/github.js';
import { GitHubProjectsError } from '../types/mcp.js';

interface ProjectItemsResponse {
  node: {
    items: ProjectV2ItemConnection;
  } | null;
}

interface ProjectItemResponse {
  node: ProjectV2Item | null;
}

interface AddDraftIssueResponse {
  addProjectV2DraftIssue: AddProjectV2DraftIssuePayload;
}

interface AddItemByIdResponse {
  addProjectV2ItemById: AddProjectV2ItemByIdPayload;
}

interface UpdateItemFieldResponse {
  updateProjectV2ItemFieldValue: UpdateProjectV2ItemFieldValuePayload;
}

interface DeleteItemResponse {
  deleteProjectV2Item: DeleteProjectV2ItemPayload;
}

export async function listProjectItems(
  client: GitHubGraphQLClient,
  input: ListProjectItemsInput
): Promise<ListProjectItemsOutput> {
  const { projectId, first = 20, after } = input;

  const response = await client.request<ProjectItemsResponse>(GET_PROJECT_ITEMS, {
    projectId,
    first,
    after,
  });

  if (!response.node) {
    throw new GitHubProjectsError('PROJECT_NOT_FOUND', `Project ${projectId} not found`);
  }

  const { nodes, pageInfo, totalCount } = response.node.items;

  return {
    items: nodes,
    totalCount,
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

export async function getProjectItem(
  client: GitHubGraphQLClient,
  input: GetProjectItemInput
): Promise<GetProjectItemOutput> {
  const { itemId } = input;

  const response = await client.request<ProjectItemResponse>(GET_PROJECT_ITEM, {
    itemId,
  });

  if (!response.node) {
    throw new GitHubProjectsError('ITEM_NOT_FOUND', `Item ${itemId} not found`);
  }

  return { item: response.node };
}

export async function addDraftIssue(
  client: GitHubGraphQLClient,
  input: AddDraftIssueInput
): Promise<AddDraftIssueOutput> {
  const { projectId, title, body, assigneeIds } = input;

  const response = await client.request<AddDraftIssueResponse>(ADD_DRAFT_ISSUE, {
    input: {
      projectId,
      title,
      body,
      assigneeIds,
    },
  });

  if (!response.addProjectV2DraftIssue.projectItem) {
    throw new GitHubProjectsError('ADD_DRAFT_FAILED', 'Failed to add draft issue');
  }

  return { item: response.addProjectV2DraftIssue.projectItem };
}

export async function addExistingIssue(
  client: GitHubGraphQLClient,
  input: AddExistingIssueInput
): Promise<AddExistingIssueOutput> {
  const { projectId, contentId } = input;

  const response = await client.request<AddItemByIdResponse>(ADD_ITEM_BY_ID, {
    input: {
      projectId,
      contentId,
    },
  });

  if (!response.addProjectV2ItemById.item) {
    throw new GitHubProjectsError('ADD_ITEM_FAILED', 'Failed to add item to project');
  }

  return { item: response.addProjectV2ItemById.item };
}

export async function updateItemField(
  client: GitHubGraphQLClient,
  input: UpdateItemFieldInput
): Promise<UpdateItemFieldOutput> {
  const { projectId, itemId, fieldId, value } = input;

  const response = await client.request<UpdateItemFieldResponse>(UPDATE_ITEM_FIELD_VALUE, {
    input: {
      projectId,
      itemId,
      fieldId,
      value,
    },
  });

  if (!response.updateProjectV2ItemFieldValue.projectV2Item) {
    throw new GitHubProjectsError('UPDATE_FIELD_FAILED', 'Failed to update item field');
  }

  return { item: response.updateProjectV2ItemFieldValue.projectV2Item };
}

export async function removeProjectItem(
  client: GitHubGraphQLClient,
  input: RemoveProjectItemInput
): Promise<RemoveProjectItemOutput> {
  const { projectId, itemId } = input;

  const response = await client.request<DeleteItemResponse>(DELETE_ITEM, {
    input: {
      projectId,
      itemId,
    },
  });

  if (!response.deleteProjectV2Item.deletedItemId) {
    throw new GitHubProjectsError('DELETE_ITEM_FAILED', 'Failed to remove item from project');
  }

  return { deletedItemId: response.deleteProjectV2Item.deletedItemId };
}
