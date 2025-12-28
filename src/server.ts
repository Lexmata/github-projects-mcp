import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { createAuthProvider } from './auth/index.js';
import type { Config } from './config.js';
import { GitHubGraphQLClient } from './graphql/client.js';
import {
  addDraftIssue,
  addExistingIssue,
  createField,
  createProject,
  deleteField,
  deleteProject,
  getProject,
  getProjectItem,
  getProjectView,
  listProjectFields,
  listProjectItems,
  listProjects,
  listProjectViews,
  removeProjectItem,
  updateField,
  updateItemField,
  updateProject,
} from './tools/index.js';
import { GitHubProjectsError } from './types/mcp.js';

// Input validation schemas
const ListProjectsSchema = z.object({
  owner: z.string().describe('The username or organization name'),
  ownerType: z.enum(['user', 'organization']).describe('Whether the owner is a user or organization'),
  first: z.number().optional().describe('Number of projects to return (default: 20, max: 100)'),
  after: z.string().optional().describe('Cursor for pagination'),
});

const GetProjectSchema = z.object({
  owner: z.string().describe('The username or organization name'),
  ownerType: z.enum(['user', 'organization']).describe('Whether the owner is a user or organization'),
  projectNumber: z.number().describe('The project number'),
});

const CreateProjectSchema = z.object({
  owner: z.string().describe('The username or organization name'),
  ownerType: z.enum(['user', 'organization']).describe('Whether the owner is a user or organization'),
  title: z.string().describe('The title of the project'),
});

const UpdateProjectSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  title: z.string().optional().describe('New title for the project'),
  shortDescription: z.string().optional().describe('New short description'),
  readme: z.string().optional().describe('New readme content'),
  closed: z.boolean().optional().describe('Whether to close the project'),
  public: z.boolean().optional().describe('Whether the project is public'),
});

const DeleteProjectSchema = z.object({
  projectId: z.string().describe('The global ID of the project to delete'),
});

const ListProjectItemsSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  first: z.number().optional().describe('Number of items to return (default: 20, max: 100)'),
  after: z.string().optional().describe('Cursor for pagination'),
});

const GetProjectItemSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  itemId: z.string().describe('The global ID of the item'),
});

const AddDraftIssueSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  title: z.string().describe('Title of the draft issue'),
  body: z.string().optional().describe('Body content of the draft issue'),
  assigneeIds: z.array(z.string()).optional().describe('Array of user IDs to assign'),
});

const AddExistingIssueSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  contentId: z.string().describe('The global ID of the issue or pull request to add'),
});

const UpdateItemFieldSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  itemId: z.string().describe('The global ID of the item'),
  fieldId: z.string().describe('The global ID of the field'),
  value: z.object({
    text: z.string().optional().describe('Text value for TEXT fields'),
    number: z.number().optional().describe('Number value for NUMBER fields'),
    date: z.string().optional().describe('Date value (YYYY-MM-DD) for DATE fields'),
    singleSelectOptionId: z.string().optional().describe('Option ID for SINGLE_SELECT fields'),
    iterationId: z.string().optional().describe('Iteration ID for ITERATION fields'),
  }).describe('The value to set'),
});

const RemoveProjectItemSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  itemId: z.string().describe('The global ID of the item to remove'),
});

const ListProjectFieldsSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  first: z.number().optional().describe('Number of fields to return (default: 50)'),
  after: z.string().optional().describe('Cursor for pagination'),
});

const CreateFieldSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  name: z.string().describe('Name of the field'),
  dataType: z.enum(['TEXT', 'NUMBER', 'DATE', 'SINGLE_SELECT', 'ITERATION']).describe('Type of field'),
  singleSelectOptions: z.array(z.object({
    name: z.string(),
    color: z.string(),
    description: z.string().optional(),
  })).optional().describe('Options for SINGLE_SELECT fields'),
});

const UpdateFieldSchema = z.object({
  fieldId: z.string().describe('The global ID of the field'),
  name: z.string().describe('New name for the field'),
});

const DeleteFieldSchema = z.object({
  fieldId: z.string().describe('The global ID of the field to delete'),
});

const ListProjectViewsSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  first: z.number().optional().describe('Number of views to return (default: 20)'),
  after: z.string().optional().describe('Cursor for pagination'),
});

const GetProjectViewSchema = z.object({
  projectId: z.string().describe('The global ID of the project'),
  viewNumber: z.number().describe('The view number'),
});

const TOOLS = [
  {
    name: 'list_projects',
    description: 'List GitHub Projects V2 for a user or organization',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'The username or organization name' },
        ownerType: { type: 'string', enum: ['user', 'organization'], description: 'Whether the owner is a user or organization' },
        first: { type: 'number', description: 'Number of projects to return (default: 20, max: 100)' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['owner', 'ownerType'],
    },
  },
  {
    name: 'get_project',
    description: 'Get detailed information about a specific GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'The username or organization name' },
        ownerType: { type: 'string', enum: ['user', 'organization'], description: 'Whether the owner is a user or organization' },
        projectNumber: { type: 'number', description: 'The project number' },
      },
      required: ['owner', 'ownerType', 'projectNumber'],
    },
  },
  {
    name: 'create_project',
    description: 'Create a new GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'The username or organization name' },
        ownerType: { type: 'string', enum: ['user', 'organization'], description: 'Whether the owner is a user or organization' },
        title: { type: 'string', description: 'The title of the project' },
      },
      required: ['owner', 'ownerType', 'title'],
    },
  },
  {
    name: 'update_project',
    description: 'Update a GitHub Project V2 (title, description, readme, visibility, or closed status)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        title: { type: 'string', description: 'New title for the project' },
        shortDescription: { type: 'string', description: 'New short description' },
        readme: { type: 'string', description: 'New readme content' },
        closed: { type: 'boolean', description: 'Whether to close the project' },
        public: { type: 'boolean', description: 'Whether the project is public' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'delete_project',
    description: 'Delete a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project to delete' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_project_items',
    description: 'List all items (issues, pull requests, draft issues) in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        first: { type: 'number', description: 'Number of items to return (default: 20, max: 100)' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'get_project_item',
    description: 'Get detailed information about a specific item in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        itemId: { type: 'string', description: 'The global ID of the item' },
      },
      required: ['projectId', 'itemId'],
    },
  },
  {
    name: 'add_draft_issue',
    description: 'Add a new draft issue to a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        title: { type: 'string', description: 'Title of the draft issue' },
        body: { type: 'string', description: 'Body content of the draft issue' },
        assigneeIds: { type: 'array', items: { type: 'string' }, description: 'Array of user IDs to assign' },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'add_existing_issue',
    description: 'Add an existing issue or pull request to a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        contentId: { type: 'string', description: 'The global ID of the issue or pull request to add' },
      },
      required: ['projectId', 'contentId'],
    },
  },
  {
    name: 'update_item_field',
    description: 'Update a field value on an item in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        itemId: { type: 'string', description: 'The global ID of the item' },
        fieldId: { type: 'string', description: 'The global ID of the field' },
        value: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Text value for TEXT fields' },
            number: { type: 'number', description: 'Number value for NUMBER fields' },
            date: { type: 'string', description: 'Date value (YYYY-MM-DD) for DATE fields' },
            singleSelectOptionId: { type: 'string', description: 'Option ID for SINGLE_SELECT fields' },
            iterationId: { type: 'string', description: 'Iteration ID for ITERATION fields' },
          },
          description: 'The value to set',
        },
      },
      required: ['projectId', 'itemId', 'fieldId', 'value'],
    },
  },
  {
    name: 'remove_project_item',
    description: 'Remove an item from a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        itemId: { type: 'string', description: 'The global ID of the item to remove' },
      },
      required: ['projectId', 'itemId'],
    },
  },
  {
    name: 'list_project_fields',
    description: 'List all fields in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        first: { type: 'number', description: 'Number of fields to return (default: 50)' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'create_field',
    description: 'Create a new custom field in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        name: { type: 'string', description: 'Name of the field' },
        dataType: { type: 'string', enum: ['TEXT', 'NUMBER', 'DATE', 'SINGLE_SELECT', 'ITERATION'], description: 'Type of field' },
        singleSelectOptions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              color: { type: 'string' },
              description: { type: 'string' },
            },
            required: ['name', 'color'],
          },
          description: 'Options for SINGLE_SELECT fields',
        },
      },
      required: ['projectId', 'name', 'dataType'],
    },
  },
  {
    name: 'update_field',
    description: 'Update a field in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fieldId: { type: 'string', description: 'The global ID of the field' },
        name: { type: 'string', description: 'New name for the field' },
      },
      required: ['fieldId', 'name'],
    },
  },
  {
    name: 'delete_field',
    description: 'Delete a custom field from a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fieldId: { type: 'string', description: 'The global ID of the field to delete' },
      },
      required: ['fieldId'],
    },
  },
  {
    name: 'list_project_views',
    description: 'List all views in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        first: { type: 'number', description: 'Number of views to return (default: 20)' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'get_project_view',
    description: 'Get detailed information about a specific view in a GitHub Project V2',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectId: { type: 'string', description: 'The global ID of the project' },
        viewNumber: { type: 'number', description: 'The view number' },
      },
      required: ['projectId', 'viewNumber'],
    },
  },
];

export function createServer(config: Config): Server {
  const authProvider = createAuthProvider(config.auth);
  const graphqlClient = new GitHubGraphQLClient(config, authProvider);

  const server = new Server(
    {
      name: 'github-projects-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'list_projects': {
          const input = ListProjectsSchema.parse(args);
          const result = await listProjects(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'get_project': {
          const input = GetProjectSchema.parse(args);
          const result = await getProject(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'create_project': {
          const input = CreateProjectSchema.parse(args);
          const result = await createProject(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'update_project': {
          const input = UpdateProjectSchema.parse(args);
          const result = await updateProject(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'delete_project': {
          const input = DeleteProjectSchema.parse(args);
          const result = await deleteProject(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'list_project_items': {
          const input = ListProjectItemsSchema.parse(args);
          const result = await listProjectItems(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'get_project_item': {
          const input = GetProjectItemSchema.parse(args);
          const result = await getProjectItem(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'add_draft_issue': {
          const input = AddDraftIssueSchema.parse(args);
          const result = await addDraftIssue(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'add_existing_issue': {
          const input = AddExistingIssueSchema.parse(args);
          const result = await addExistingIssue(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'update_item_field': {
          const input = UpdateItemFieldSchema.parse(args);
          const result = await updateItemField(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'remove_project_item': {
          const input = RemoveProjectItemSchema.parse(args);
          const result = await removeProjectItem(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'list_project_fields': {
          const input = ListProjectFieldsSchema.parse(args);
          const result = await listProjectFields(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'create_field': {
          const input = CreateFieldSchema.parse(args);
          const result = await createField(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'update_field': {
          const input = UpdateFieldSchema.parse(args);
          const result = await updateField(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'delete_field': {
          const input = DeleteFieldSchema.parse(args);
          const result = await deleteField(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'list_project_views': {
          const input = ListProjectViewsSchema.parse(args);
          const result = await listProjectViews(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'get_project_view': {
          const input = GetProjectViewSchema.parse(args);
          const result = await getProjectView(graphqlClient, input);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'VALIDATION_ERROR',
                message: 'Invalid input parameters',
                details: error.errors,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }

      if (error instanceof GitHubProjectsError) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error.code,
                message: error.message,
                details: error.details,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'INTERNAL_ERROR',
              message,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function runServer(config: Config): Promise<void> {
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
