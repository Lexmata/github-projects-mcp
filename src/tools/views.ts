import type { GitHubGraphQLClient } from '../graphql/client.js';
import { GET_PROJECT_VIEW, GET_PROJECT_VIEWS } from '../graphql/queries.js';
import type {
  GetProjectViewInput,
  GetProjectViewOutput,
  ListProjectViewsInput,
  ListProjectViewsOutput,
} from '../types/mcp.js';
import type { ProjectV2View, ProjectV2ViewConnection } from '../types/github.js';
import { GitHubProjectsError } from '../types/mcp.js';

interface ProjectViewsResponse {
  node: {
    views: ProjectV2ViewConnection;
  } | null;
}

interface ProjectViewResponse {
  node: {
    view: ProjectV2View | null;
  } | null;
}

export async function listProjectViews(
  client: GitHubGraphQLClient,
  input: ListProjectViewsInput
): Promise<ListProjectViewsOutput> {
  const { projectId, first = 20, after } = input;

  const response = await client.request<ProjectViewsResponse>(GET_PROJECT_VIEWS, {
    projectId,
    first,
    after,
  });

  if (!response.node) {
    throw new GitHubProjectsError('PROJECT_NOT_FOUND', `Project ${projectId} not found`);
  }

  const { nodes, pageInfo, totalCount } = response.node.views;

  return {
    views: nodes,
    totalCount,
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

export async function getProjectView(
  client: GitHubGraphQLClient,
  input: GetProjectViewInput
): Promise<GetProjectViewOutput> {
  const { projectId, viewNumber } = input;

  const response = await client.request<ProjectViewResponse>(GET_PROJECT_VIEW, {
    projectId,
    viewNumber,
  });

  if (!response.node) {
    throw new GitHubProjectsError('PROJECT_NOT_FOUND', `Project ${projectId} not found`);
  }

  if (!response.node.view) {
    throw new GitHubProjectsError(
      'VIEW_NOT_FOUND',
      `View #${viewNumber} not found in project ${projectId}`
    );
  }

  return { view: response.node.view };
}
