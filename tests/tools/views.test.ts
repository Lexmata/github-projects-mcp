import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { GitHubGraphQLClient } from '../../src/graphql/client.js';
import { getProjectView, listProjectViews } from '../../src/tools/views.js';
import { GitHubProjectsError } from '../../src/types/mcp.js';

describe('views tools', () => {
  let mockClient: GitHubGraphQLClient;

  beforeEach(() => {
    mockClient = {
      request: vi.fn(),
    } as unknown as GitHubGraphQLClient;
  });

  describe('listProjectViews', () => {
    it('should list project views', async () => {
      const mockResponse = {
        node: {
          views: {
            nodes: [
              { id: 'view-1', name: 'Board', number: 1, layout: 'BOARD_LAYOUT', filter: null },
              { id: 'view-2', name: 'Table', number: 2, layout: 'TABLE_LAYOUT', filter: 'status:open' },
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

      const result = await listProjectViews(mockClient, {
        projectId: 'proj-1',
      });

      expect(result.views).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.views[0]?.layout).toBe('BOARD_LAYOUT');
    });

    it('should handle pagination', async () => {
      const mockResponse = {
        node: {
          views: {
            nodes: [
              { id: 'view-3', name: 'Roadmap', number: 3, layout: 'ROADMAP_LAYOUT', filter: null },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: 'start',
              endCursor: 'end',
            },
            totalCount: 3,
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await listProjectViews(mockClient, {
        projectId: 'proj-1',
        first: 1,
        after: 'cursor',
      });

      expect(result.views).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
    });

    it('should throw error when project not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({ node: null });

      await expect(
        listProjectViews(mockClient, { projectId: 'invalid-proj' })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('getProjectView', () => {
    it('should get project view by number', async () => {
      const mockResponse = {
        node: {
          view: {
            id: 'view-1',
            name: 'Board View',
            number: 1,
            layout: 'BOARD_LAYOUT',
            filter: 'status:todo',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await getProjectView(mockClient, {
        projectId: 'proj-1',
        viewNumber: 1,
      });

      expect(result.view.id).toBe('view-1');
      expect(result.view.name).toBe('Board View');
      expect(result.view.layout).toBe('BOARD_LAYOUT');
    });

    it('should throw error when project not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({ node: null });

      await expect(
        getProjectView(mockClient, {
          projectId: 'invalid-proj',
          viewNumber: 1,
        })
      ).rejects.toThrow(GitHubProjectsError);
    });

    it('should throw error when view not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        node: {
          view: null,
        },
      });

      await expect(
        getProjectView(mockClient, {
          projectId: 'proj-1',
          viewNumber: 999,
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });
});
