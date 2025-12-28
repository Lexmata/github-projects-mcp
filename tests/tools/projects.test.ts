import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { GitHubGraphQLClient } from '../../src/graphql/client.js';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../../src/tools/projects.js';
import { GitHubProjectsError } from '../../src/types/mcp.js';

describe('projects tools', () => {
  let mockClient: GitHubGraphQLClient;

  beforeEach(() => {
    mockClient = {
      request: vi.fn(),
    } as unknown as GitHubGraphQLClient;
  });

  describe('listProjects', () => {
    it('should list user projects', async () => {
      const mockResponse = {
        user: {
          projectsV2: {
            nodes: [
              { id: 'proj-1', number: 1, title: 'Project 1' },
              { id: 'proj-2', number: 2, title: 'Project 2' },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'start',
              endCursor: 'end',
            },
            totalCount: 2,
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await listProjects(mockClient, {
        owner: 'testuser',
        ownerType: 'user',
      });

      expect(result.projects).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.hasNextPage).toBe(false);
    });

    it('should list organization projects', async () => {
      const mockResponse = {
        organization: {
          projectsV2: {
            nodes: [{ id: 'proj-1', number: 1, title: 'Org Project' }],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: 'start',
              endCursor: 'cursor-123',
            },
            totalCount: 50,
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await listProjects(mockClient, {
        owner: 'testorg',
        ownerType: 'organization',
        first: 10,
        after: 'prev-cursor',
      });

      expect(result.projects).toHaveLength(1);
      expect(result.totalCount).toBe(50);
      expect(result.hasNextPage).toBe(true);
      expect(result.endCursor).toBe('cursor-123');
    });
  });

  describe('getProject', () => {
    it('should get user project by number', async () => {
      const mockResponse = {
        user: {
          projectV2: {
            id: 'proj-1',
            number: 1,
            title: 'My Project',
            shortDescription: 'A test project',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await getProject(mockClient, {
        owner: 'testuser',
        ownerType: 'user',
        projectNumber: 1,
      });

      expect(result.project.id).toBe('proj-1');
      expect(result.project.title).toBe('My Project');
    });

    it('should get organization project by number', async () => {
      const mockResponse = {
        organization: {
          projectV2: {
            id: 'proj-org-1',
            number: 5,
            title: 'Org Project',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await getProject(mockClient, {
        owner: 'testorg',
        ownerType: 'organization',
        projectNumber: 5,
      });

      expect(result.project.id).toBe('proj-org-1');
    });

    it('should throw error when user project not found', async () => {
      const mockResponse = {
        user: {
          projectV2: null,
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      await expect(
        getProject(mockClient, {
          owner: 'testuser',
          ownerType: 'user',
          projectNumber: 999,
        })
      ).rejects.toThrow(GitHubProjectsError);
    });

    it('should throw error when organization project not found', async () => {
      const mockResponse = {
        organization: {
          projectV2: null,
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      await expect(
        getProject(mockClient, {
          owner: 'testorg',
          ownerType: 'organization',
          projectNumber: 999,
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('createProject', () => {
    it('should create project for user', async () => {
      vi.mocked(mockClient.request)
        .mockResolvedValueOnce({ user: { id: 'user-id-123' } })
        .mockResolvedValueOnce({
          createProjectV2: {
            projectV2: {
              id: 'new-proj-id',
              number: 1,
              title: 'New Project',
            },
          },
        });

      const result = await createProject(mockClient, {
        owner: 'testuser',
        ownerType: 'user',
        title: 'New Project',
      });

      expect(result.project.id).toBe('new-proj-id');
      expect(result.project.title).toBe('New Project');
    });

    it('should create project for organization', async () => {
      vi.mocked(mockClient.request)
        .mockResolvedValueOnce({ organization: { id: 'org-id-456' } })
        .mockResolvedValueOnce({
          createProjectV2: {
            projectV2: {
              id: 'new-org-proj-id',
              number: 1,
              title: 'Org Project',
            },
          },
        });

      const result = await createProject(mockClient, {
        owner: 'testorg',
        ownerType: 'organization',
        title: 'Org Project',
      });

      expect(result.project.id).toBe('new-org-proj-id');
    });

    it('should throw error when user not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValueOnce({ user: null });

      await expect(
        createProject(mockClient, {
          owner: 'nonexistent',
          ownerType: 'user',
          title: 'New Project',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });

    it('should throw error when organization not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValueOnce({ organization: null });

      await expect(
        createProject(mockClient, {
          owner: 'nonexistent',
          ownerType: 'organization',
          title: 'New Project',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });

    it('should throw error when create fails', async () => {
      vi.mocked(mockClient.request)
        .mockResolvedValueOnce({ user: { id: 'user-id-123' } })
        .mockResolvedValueOnce({
          createProjectV2: {
            projectV2: null,
          },
        });

      await expect(
        createProject(mockClient, {
          owner: 'testuser',
          ownerType: 'user',
          title: 'New Project',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('updateProject', () => {
    it('should update project', async () => {
      const mockResponse = {
        updateProjectV2: {
          projectV2: {
            id: 'proj-1',
            title: 'Updated Title',
            shortDescription: 'Updated description',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await updateProject(mockClient, {
        projectId: 'proj-1',
        title: 'Updated Title',
        shortDescription: 'Updated description',
      });

      expect(result.project.title).toBe('Updated Title');
    });

    it('should throw error when update fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        updateProjectV2: {
          projectV2: null,
        },
      });

      await expect(
        updateProject(mockClient, {
          projectId: 'proj-1',
          title: 'New Title',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('deleteProject', () => {
    it('should delete project', async () => {
      const mockResponse = {
        deleteProjectV2: {
          projectV2: {
            id: 'proj-1',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await deleteProject(mockClient, {
        projectId: 'proj-1',
      });

      expect(result.deletedProjectId).toBe('proj-1');
    });

    it('should throw error when delete fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        deleteProjectV2: {
          projectV2: null,
        },
      });

      await expect(
        deleteProject(mockClient, {
          projectId: 'proj-1',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });
});
