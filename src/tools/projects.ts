import type { GitHubGraphQLClient } from '../graphql/client.js';
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
} from '../graphql/mutations.js';
import {
  GET_ORG_ID,
  GET_ORG_PROJECT,
  GET_ORG_PROJECTS,
  GET_USER_ID,
  GET_USER_PROJECT,
  GET_USER_PROJECTS,
} from '../graphql/queries.js';
import type {
  CreateProjectInput,
  CreateProjectOutput,
  DeleteProjectInput,
  DeleteProjectOutput,
  GetProjectInput,
  GetProjectOutput,
  ListProjectsInput,
  ListProjectsOutput,
  UpdateProjectInput,
  UpdateProjectOutput,
} from '../types/mcp.js';
import type {
  CreateProjectV2Payload,
  DeleteProjectV2Payload,
  ProjectV2,
  ProjectV2Connection,
  UpdateProjectV2Payload,
} from '../types/github.js';
import { GitHubProjectsError } from '../types/mcp.js';

interface UserProjectsResponse {
  user: {
    projectsV2: ProjectV2Connection;
  };
}

interface OrgProjectsResponse {
  organization: {
    projectsV2: ProjectV2Connection;
  };
}

interface UserProjectResponse {
  user: {
    projectV2: ProjectV2 | null;
  };
}

interface OrgProjectResponse {
  organization: {
    projectV2: ProjectV2 | null;
  };
}

interface UserIdResponse {
  user: {
    id: string;
  } | null;
}

interface OrgIdResponse {
  organization: {
    id: string;
  } | null;
}

interface CreateProjectResponse {
  createProjectV2: CreateProjectV2Payload;
}

interface UpdateProjectResponse {
  updateProjectV2: UpdateProjectV2Payload;
}

interface DeleteProjectResponse {
  deleteProjectV2: DeleteProjectV2Payload;
}

export async function listProjects(
  client: GitHubGraphQLClient,
  input: ListProjectsInput
): Promise<ListProjectsOutput> {
  const { owner, ownerType, first = 20, after } = input;

  if (ownerType === 'user') {
    const response = await client.request<UserProjectsResponse>(GET_USER_PROJECTS, {
      login: owner,
      first,
      after,
    });

    const { nodes, pageInfo, totalCount } = response.user.projectsV2;

    return {
      projects: nodes,
      totalCount,
      hasNextPage: pageInfo.hasNextPage,
      endCursor: pageInfo.endCursor,
    };
  }

  const response = await client.request<OrgProjectsResponse>(GET_ORG_PROJECTS, {
    login: owner,
    first,
    after,
  });

  const { nodes, pageInfo, totalCount } = response.organization.projectsV2;

  return {
    projects: nodes,
    totalCount,
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

export async function getProject(
  client: GitHubGraphQLClient,
  input: GetProjectInput
): Promise<GetProjectOutput> {
  const { owner, ownerType, projectNumber } = input;

  if (ownerType === 'user') {
    const response = await client.request<UserProjectResponse>(GET_USER_PROJECT, {
      login: owner,
      number: projectNumber,
    });

    if (!response.user.projectV2) {
      throw new GitHubProjectsError(
        'PROJECT_NOT_FOUND',
        `Project #${projectNumber} not found for user ${owner}`
      );
    }

    return { project: response.user.projectV2 };
  }

  const response = await client.request<OrgProjectResponse>(GET_ORG_PROJECT, {
    login: owner,
    number: projectNumber,
  });

  if (!response.organization.projectV2) {
    throw new GitHubProjectsError(
      'PROJECT_NOT_FOUND',
      `Project #${projectNumber} not found for organization ${owner}`
    );
  }

  return { project: response.organization.projectV2 };
}

export async function createProject(
  client: GitHubGraphQLClient,
  input: CreateProjectInput
): Promise<CreateProjectOutput> {
  const { owner, ownerType, title } = input;

  let ownerId: string;

  if (ownerType === 'user') {
    const response = await client.request<UserIdResponse>(GET_USER_ID, {
      login: owner,
    });

    if (!response.user) {
      throw new GitHubProjectsError('USER_NOT_FOUND', `User ${owner} not found`);
    }

    ownerId = response.user.id;
  } else {
    const response = await client.request<OrgIdResponse>(GET_ORG_ID, {
      login: owner,
    });

    if (!response.organization) {
      throw new GitHubProjectsError('ORG_NOT_FOUND', `Organization ${owner} not found`);
    }

    ownerId = response.organization.id;
  }

  const response = await client.request<CreateProjectResponse>(CREATE_PROJECT, {
    input: {
      ownerId,
      title,
    },
  });

  if (!response.createProjectV2.projectV2) {
    throw new GitHubProjectsError('CREATE_FAILED', 'Failed to create project');
  }

  return { project: response.createProjectV2.projectV2 };
}

export async function updateProject(
  client: GitHubGraphQLClient,
  input: UpdateProjectInput
): Promise<UpdateProjectOutput> {
  const { projectId, ...updates } = input;

  const response = await client.request<UpdateProjectResponse>(UPDATE_PROJECT, {
    input: {
      projectId,
      ...updates,
    },
  });

  if (!response.updateProjectV2.projectV2) {
    throw new GitHubProjectsError('UPDATE_FAILED', 'Failed to update project');
  }

  return { project: response.updateProjectV2.projectV2 };
}

export async function deleteProject(
  client: GitHubGraphQLClient,
  input: DeleteProjectInput
): Promise<DeleteProjectOutput> {
  const { projectId } = input;

  const response = await client.request<DeleteProjectResponse>(DELETE_PROJECT, {
    input: {
      projectId,
    },
  });

  if (!response.deleteProjectV2.projectV2) {
    throw new GitHubProjectsError('DELETE_FAILED', 'Failed to delete project');
  }

  return { deletedProjectId: response.deleteProjectV2.projectV2.id };
}
