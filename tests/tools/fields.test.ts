import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { GitHubGraphQLClient } from '../../src/graphql/client.js';
import {
  createField,
  deleteField,
  listProjectFields,
  updateField,
} from '../../src/tools/fields.js';
import { GitHubProjectsError } from '../../src/types/mcp.js';

describe('fields tools', () => {
  let mockClient: GitHubGraphQLClient;

  beforeEach(() => {
    mockClient = {
      request: vi.fn(),
    } as unknown as GitHubGraphQLClient;
  });

  describe('listProjectFields', () => {
    it('should list project fields', async () => {
      const mockResponse = {
        node: {
          fields: {
            nodes: [
              { __typename: 'ProjectV2Field', id: 'field-1', name: 'Title', dataType: 'TITLE' },
              { __typename: 'ProjectV2Field', id: 'field-2', name: 'Status', dataType: 'SINGLE_SELECT' },
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

      const result = await listProjectFields(mockClient, {
        projectId: 'proj-1',
      });

      expect(result.fields).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should handle pagination', async () => {
      const mockResponse = {
        node: {
          fields: {
            nodes: [
              { __typename: 'ProjectV2Field', id: 'field-3', name: 'Notes', dataType: 'TEXT' },
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

      const result = await listProjectFields(mockClient, {
        projectId: 'proj-1',
        first: 1,
        after: 'cursor',
      });

      expect(result.fields).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
    });

    it('should throw error when project not found', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({ node: null });

      await expect(
        listProjectFields(mockClient, { projectId: 'invalid-proj' })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('createField', () => {
    it('should create a text field', async () => {
      const mockResponse = {
        createProjectV2Field: {
          projectV2Field: {
            __typename: 'ProjectV2Field',
            id: 'new-field-1',
            name: 'Notes',
            dataType: 'TEXT',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await createField(mockClient, {
        projectId: 'proj-1',
        name: 'Notes',
        dataType: 'TEXT',
      });

      expect(result.field.id).toBe('new-field-1');
      expect(result.field.name).toBe('Notes');
    });

    it('should create a single select field with options', async () => {
      const mockResponse = {
        createProjectV2Field: {
          projectV2Field: {
            __typename: 'ProjectV2SingleSelectField',
            id: 'new-field-2',
            name: 'Priority',
            dataType: 'SINGLE_SELECT',
            options: [
              { id: 'opt-1', name: 'High', color: 'RED', description: null },
              { id: 'opt-2', name: 'Low', color: 'GREEN', description: null },
            ],
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await createField(mockClient, {
        projectId: 'proj-1',
        name: 'Priority',
        dataType: 'SINGLE_SELECT',
        singleSelectOptions: [
          { name: 'High', color: 'RED' },
          { name: 'Low', color: 'GREEN' },
        ],
      });

      expect(result.field.id).toBe('new-field-2');
    });

    it('should create a number field', async () => {
      const mockResponse = {
        createProjectV2Field: {
          projectV2Field: {
            __typename: 'ProjectV2Field',
            id: 'new-field-3',
            name: 'Points',
            dataType: 'NUMBER',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await createField(mockClient, {
        projectId: 'proj-1',
        name: 'Points',
        dataType: 'NUMBER',
      });

      expect(result.field.id).toBe('new-field-3');
      expect(result.field.dataType).toBe('NUMBER');
    });

    it('should create a date field', async () => {
      const mockResponse = {
        createProjectV2Field: {
          projectV2Field: {
            __typename: 'ProjectV2Field',
            id: 'new-field-4',
            name: 'Due Date',
            dataType: 'DATE',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await createField(mockClient, {
        projectId: 'proj-1',
        name: 'Due Date',
        dataType: 'DATE',
      });

      expect(result.field.dataType).toBe('DATE');
    });

    it('should throw error when create fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        createProjectV2Field: {
          projectV2Field: null,
        },
      });

      await expect(
        createField(mockClient, {
          projectId: 'proj-1',
          name: 'Failed Field',
          dataType: 'TEXT',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('updateField', () => {
    it('should update field name', async () => {
      const mockResponse = {
        updateProjectV2Field: {
          projectV2Field: {
            __typename: 'ProjectV2Field',
            id: 'field-1',
            name: 'Updated Name',
            dataType: 'TEXT',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await updateField(mockClient, {
        fieldId: 'field-1',
        name: 'Updated Name',
      });

      expect(result.field.name).toBe('Updated Name');
    });

    it('should throw error when update fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        updateProjectV2Field: {
          projectV2Field: null,
        },
      });

      await expect(
        updateField(mockClient, {
          fieldId: 'field-1',
          name: 'New Name',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });

  describe('deleteField', () => {
    it('should delete field', async () => {
      const mockResponse = {
        deleteProjectV2Field: {
          projectV2Field: {
            id: 'field-1',
          },
        },
      };
      vi.mocked(mockClient.request).mockResolvedValue(mockResponse);

      const result = await deleteField(mockClient, {
        fieldId: 'field-1',
      });

      expect(result.deletedFieldId).toBe('field-1');
    });

    it('should throw error when delete fails', async () => {
      vi.mocked(mockClient.request).mockResolvedValue({
        deleteProjectV2Field: {
          projectV2Field: null,
        },
      });

      await expect(
        deleteField(mockClient, {
          fieldId: 'field-1',
        })
      ).rejects.toThrow(GitHubProjectsError);
    });
  });
});
