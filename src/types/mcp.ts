// MCP-specific types for tool inputs and outputs

import type {
  ProjectV2,
  ProjectV2FieldConfiguration,
  ProjectV2Item,
  ProjectV2View,
  ProjectV2CustomFieldType,
  SingleSelectOptionInput,
} from './github.js';

// Tool Input Types

export interface ListProjectsInput {
  owner: string;
  ownerType: 'user' | 'organization';
  first?: number;
  after?: string;
}

export interface GetProjectInput {
  owner: string;
  ownerType: 'user' | 'organization';
  projectNumber: number;
}

export interface CreateProjectInput {
  owner: string;
  ownerType: 'user' | 'organization';
  title: string;
}

export interface UpdateProjectInput {
  projectId: string;
  title?: string;
  shortDescription?: string;
  readme?: string;
  closed?: boolean;
  public?: boolean;
}

export interface DeleteProjectInput {
  projectId: string;
}

export interface ListProjectItemsInput {
  projectId: string;
  first?: number;
  after?: string;
}

export interface GetProjectItemInput {
  projectId: string;
  itemId: string;
}

export interface AddDraftIssueInput {
  projectId: string;
  title: string;
  body?: string;
  assigneeIds?: string[];
}

export interface AddExistingIssueInput {
  projectId: string;
  contentId: string;
}

export interface UpdateItemFieldInput {
  projectId: string;
  itemId: string;
  fieldId: string;
  value: {
    text?: string;
    number?: number;
    date?: string;
    singleSelectOptionId?: string;
    iterationId?: string;
  };
}

export interface RemoveProjectItemInput {
  projectId: string;
  itemId: string;
}

export interface ListProjectFieldsInput {
  projectId: string;
  first?: number;
  after?: string;
}

export interface CreateFieldInput {
  projectId: string;
  name: string;
  dataType: ProjectV2CustomFieldType;
  singleSelectOptions?: SingleSelectOptionInput[];
}

export interface UpdateFieldInput {
  fieldId: string;
  name: string;
}

export interface DeleteFieldInput {
  fieldId: string;
}

export interface ListProjectViewsInput {
  projectId: string;
  first?: number;
  after?: string;
}

export interface GetProjectViewInput {
  projectId: string;
  viewNumber: number;
}

// Tool Output Types

export interface ListProjectsOutput {
  projects: ProjectV2[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetProjectOutput {
  project: ProjectV2;
}

export interface CreateProjectOutput {
  project: ProjectV2;
}

export interface UpdateProjectOutput {
  project: ProjectV2;
}

export interface DeleteProjectOutput {
  deletedProjectId: string;
}

export interface ListProjectItemsOutput {
  items: ProjectV2Item[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetProjectItemOutput {
  item: ProjectV2Item;
}

export interface AddDraftIssueOutput {
  item: ProjectV2Item;
}

export interface AddExistingIssueOutput {
  item: ProjectV2Item;
}

export interface UpdateItemFieldOutput {
  item: ProjectV2Item;
}

export interface RemoveProjectItemOutput {
  deletedItemId: string;
}

export interface ListProjectFieldsOutput {
  fields: ProjectV2FieldConfiguration[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface CreateFieldOutput {
  field: ProjectV2FieldConfiguration;
}

export interface UpdateFieldOutput {
  field: ProjectV2FieldConfiguration;
}

export interface DeleteFieldOutput {
  deletedFieldId: string;
}

export interface ListProjectViewsOutput {
  views: ProjectV2View[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface GetProjectViewOutput {
  view: ProjectV2View;
}

// Error types

export interface MCPError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class GitHubProjectsError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'GitHubProjectsError';
    this.code = code;
    this.details = details;
  }
}
