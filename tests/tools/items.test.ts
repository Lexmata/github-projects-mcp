import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { GitHubGraphQLClient } from '../../src/graphql/client.js';
import {
  addDraftIssue,
  addExistingIssue,
  getProjectItem,
  listProjectItems,
  removeProjectItem,
  updateItemField,
} from '../../src/tools/items.js';
import { GitHubProjectsError } from '../../src/types/mcp.js';

describe('items tools', () => {
  let mockClient: GitHubGraphQLClient;

  beforeEach(() => {
    mockClient = {
      request: vi.fn(),
    } as unknown as GitHubGraphQLClient;
  });

  describe('listProjectItems', () => {
    it('should list project items', async () => {
      const mockResponse = {
        node: {
          items: {
            nodes: [
              { id: 'item-1', type: 'ISSUE', content: { title: 'Issue 1' } },
              { id: 'item-2', type: 'DRAFT_ISSUE', content: { title: 'Draft 1' } },
            ],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: 'start',
              endCursor: 'cursor-abc',
            },
            totalCount: 100,
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await listProjectItems(mockClient, {
        projectId: 'proj-1',
        first: 20,
      });

      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(100);
      expect(result.hasNextPage).toBe(true);
      expect(result.endCursor).toBe('cursor-abc');
    });

    it('should handle pagination', async () => {
      const mockResponse = {
        node: {
          items: {
            nodes: [{ id: 'item-3', type: 'ISSUE' }],
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

      const result = await listProjectItems(mockClient, {
        projectId: 'proj-1',
        first: 10,
        after: 'cursor-abc',
      });

      expect(result.items).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
    });

    it('should throw error when project not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({ node: null });

      await expect(
        listProjectItems(mockClient, { projectId: 'invalid-proj' })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('getProjectItem', () => {
    it('should get project item', async () => {
      const mockResponse = {
        node: {
          id: 'item-1',
          type: 'ISSUE',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
          isArchived: false,
          content: {
            __typename: 'Issue',
            id: 'issue-1',
            title: 'Test Issue',
          },
          fieldValues: {
            nodes: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            totalCount: 0,
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await getProjectItem(mockClient, {
        projectId: 'proj-1',
        itemId: 'item-1',
      });

      expect(result.item.id).toBe('item-1');
      expect(result.item.type).toBe('ISSUE');
    });

    it('should throw error when item not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({ node: null });

      await expect(
        getProjectItem(mockClient, {
          projectId: 'proj-1',
          itemId: 'invalid-item',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('addDraftIssue', () => {
    it('should add draft issue to project', async () => {
      const mockResponse = {
        addProjectV2DraftIssue: {
          projectItem: {
            id: 'item-new',
            type: 'DRAFT_ISSUE',
            content: {
              __typename: 'DraftIssue',
              title: 'New Draft',
              body: 'Draft body',
            },
            fieldValues: {
              nodes: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              totalCount: 0,
            },
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await addDraftIssue(mockClient, {
        projectId: 'proj-1',
        title: 'New Draft',
        body: 'Draft body',
      });

      expect(result.item.id).toBe('item-new');
      expect(result.item.type).toBe('DRAFT_ISSUE');
    });

    it('should add draft issue with assignees', async () => {
      const mockResponse = {
        addProjectV2DraftIssue: {
          projectItem: {
            id: 'item-new',
            type: 'DRAFT_ISSUE',
            content: {
              __typename: 'DraftIssue',
              title: 'Assigned Draft',
            },
            fieldValues: {
              nodes: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              totalCount: 0,
            },
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await addDraftIssue(mockClient, {
        projectId: 'proj-1',
        title: 'Assigned Draft',
        assigneeIds: ['user-1', 'user-2'],
      });

      expect(result.item.id).toBe('item-new');
    });

    it('should throw error when add fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        addProjectV2DraftIssue: {
          projectItem: null,
        },
      });

      await expect(
        addDraftIssue(mockClient, {
          projectId: 'proj-1',
          title: 'Failed Draft',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('addExistingIssue', () => {
    it('should add existing issue to project', async () => {
      const mockResponse = {
        addProjectV2ItemById: {
          item: {
            id: 'item-existing',
            type: 'ISSUE',
            content: {
              __typename: 'Issue',
              id: 'issue-123',
              title: 'Existing Issue',
            },
            fieldValues: {
              nodes: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              totalCount: 0,
            },
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await addExistingIssue(mockClient, {
        projectId: 'proj-1',
        contentId: 'issue-123',
      });

      expect(result.item.id).toBe('item-existing');
      expect(result.item.type).toBe('ISSUE');
    });

    it('should throw error when add fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        addProjectV2ItemById: {
          item: null,
        },
      });

      await expect(
        addExistingIssue(mockClient, {
          projectId: 'proj-1',
          contentId: 'invalid-content',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('updateItemField', () => {
    it('should update item field value', async () => {
      const mockResponse = {
        updateProjectV2ItemFieldValue: {
          projectV2Item: {
            id: 'item-1',
            type: 'ISSUE',
            fieldValues: {
              nodes: [
                {
                  __typename: 'ProjectV2ItemFieldTextValue',
                  text: 'Updated text',
                  field: { id: 'field-1', name: 'Notes' },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              totalCount: 1,
            },
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await updateItemField(mockClient, {
        projectId: 'proj-1',
        itemId: 'item-1',
        fieldId: 'field-1',
        value: { text: 'Updated text' },
      });

      expect(result.item.id).toBe('item-1');
    });

    it('should update with number value', async () => {
      const mockResponse = {
        updateProjectV2ItemFieldValue: {
          projectV2Item: {
            id: 'item-1',
            type: 'ISSUE',
            fieldValues: {
              nodes: [
                {
                  __typename: 'ProjectV2ItemFieldNumberValue',
                  number: 42,
                  field: { id: 'field-2', name: 'Points' },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
              totalCount: 1,
            },
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await updateItemField(mockClient, {
        projectId: 'proj-1',
        itemId: 'item-1',
        fieldId: 'field-2',
        value: { number: 42 },
      });

      expect(result.item.id).toBe('item-1');
    });

    it('should throw error when update fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        updateProjectV2ItemFieldValue: {
          projectV2Item: null,
        },
      });

      await expect(
        updateItemField(mockClient, {
          projectId: 'proj-1',
          itemId: 'item-1',
          fieldId: 'field-1',
          value: { text: 'test' },
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('removeProjectItem', () => {
    it('should remove item from project', async () => {
      const mockResponse = {
        deleteProjectV2Item: {
          deletedItemId: 'item-1',
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await removeProjectItem(mockClient, {
        projectId: 'proj-1',
        itemId: 'item-1',
      });

      expect(result.deletedItemId).toBe('item-1');
    });

    it('should throw error when remove fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        deleteProjectV2Item: {
          deletedItemId: null,
        },
      });

      await expect(
        removeProjectItem(mockClient, {
          projectId: 'proj-1',
          itemId: 'item-1',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });
});
