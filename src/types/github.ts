// GitHub Projects V2 API Types

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ProjectV2 {
  id: string;
  number: number;
  title: string;
  shortDescription: string | null;
  public: boolean;
  closed: boolean;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
  readme: string | null;
  owner: ProjectOwner;
}

export interface ProjectOwner {
  __typename: 'User' | 'Organization';
  login: string;
  id: string;
}

export interface ProjectV2Connection {
  nodes: ProjectV2[];
  pageInfo: PageInfo;
  totalCount: number;
}

export type ProjectV2FieldType =
  | 'ASSIGNEES'
  | 'DATE'
  | 'ITERATION'
  | 'LABELS'
  | 'LINKED_PULL_REQUESTS'
  | 'MILESTONE'
  | 'NUMBER'
  | 'REPOSITORY'
  | 'REVIEWERS'
  | 'SINGLE_SELECT'
  | 'TEXT'
  | 'TITLE'
  | 'TRACKS';

export interface ProjectV2FieldCommon {
  id: string;
  name: string;
  dataType: ProjectV2FieldType;
}

export interface ProjectV2Field extends ProjectV2FieldCommon {
  __typename: 'ProjectV2Field';
}

export interface ProjectV2IterationFieldConfiguration {
  iterations: ProjectV2IterationFieldIteration[];
  completedIterations: ProjectV2IterationFieldIteration[];
  duration: number;
  startDay: number;
}

export interface ProjectV2IterationFieldIteration {
  id: string;
  title: string;
  startDate: string;
  duration: number;
}

export interface ProjectV2IterationField extends ProjectV2FieldCommon {
  __typename: 'ProjectV2IterationField';
  configuration: ProjectV2IterationFieldConfiguration;
}

export interface ProjectV2SingleSelectFieldOption {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

export interface ProjectV2SingleSelectField extends ProjectV2FieldCommon {
  __typename: 'ProjectV2SingleSelectField';
  options: ProjectV2SingleSelectFieldOption[];
}

export type ProjectV2FieldConfiguration =
  | ProjectV2Field
  | ProjectV2IterationField
  | ProjectV2SingleSelectField;

export interface ProjectV2FieldConnection {
  nodes: ProjectV2FieldConfiguration[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ProjectV2Item {
  id: string;
  type: ProjectV2ItemType;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  content: ProjectV2ItemContent | null;
  fieldValues: ProjectV2ItemFieldValueConnection;
}

export type ProjectV2ItemType = 'ISSUE' | 'PULL_REQUEST' | 'DRAFT_ISSUE' | 'REDACTED';

export interface DraftIssue {
  __typename: 'DraftIssue';
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  __typename: 'Issue';
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'OPEN' | 'CLOSED';
  url: string;
  createdAt: string;
  updatedAt: string;
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
}

export interface PullRequest {
  __typename: 'PullRequest';
  id: string;
  number: number;
  title: string;
  body: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  url: string;
  createdAt: string;
  updatedAt: string;
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
}

export type ProjectV2ItemContent = DraftIssue | Issue | PullRequest;

export interface ProjectV2ItemConnection {
  nodes: ProjectV2Item[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ProjectV2ItemFieldTextValue {
  __typename: 'ProjectV2ItemFieldTextValue';
  text: string | null;
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ItemFieldNumberValue {
  __typename: 'ProjectV2ItemFieldNumberValue';
  number: number | null;
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ItemFieldDateValue {
  __typename: 'ProjectV2ItemFieldDateValue';
  date: string | null;
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ItemFieldSingleSelectValue {
  __typename: 'ProjectV2ItemFieldSingleSelectValue';
  name: string | null;
  optionId: string | null;
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ItemFieldIterationValue {
  __typename: 'ProjectV2ItemFieldIterationValue';
  title: string | null;
  iterationId: string | null;
  startDate: string | null;
  duration: number | null;
  field: ProjectV2FieldCommon;
}

export type ProjectV2ItemFieldValue =
  | ProjectV2ItemFieldTextValue
  | ProjectV2ItemFieldNumberValue
  | ProjectV2ItemFieldDateValue
  | ProjectV2ItemFieldSingleSelectValue
  | ProjectV2ItemFieldIterationValue;

export interface ProjectV2ItemFieldValueConnection {
  nodes: ProjectV2ItemFieldValue[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ProjectV2View {
  id: string;
  name: string;
  number: number;
  layout: ProjectV2ViewLayout;
  filter: string | null;
  sortBy: ProjectV2SortBy[] | null;
  groupBy: ProjectV2GroupBy[] | null;
  verticalGroupBy: ProjectV2GroupBy[] | null;
}

export type ProjectV2ViewLayout = 'TABLE_LAYOUT' | 'BOARD_LAYOUT' | 'ROADMAP_LAYOUT';

export interface ProjectV2SortBy {
  field: ProjectV2FieldCommon;
  direction: 'ASC' | 'DESC';
}

export interface ProjectV2GroupBy {
  field: ProjectV2FieldCommon;
}

export interface ProjectV2ViewConnection {
  nodes: ProjectV2View[];
  pageInfo: PageInfo;
  totalCount: number;
}

// Mutation Input Types
export interface CreateProjectV2Input {
  ownerId: string;
  title: string;
  repositoryId?: string;
  teamId?: string;
}

export interface UpdateProjectV2Input {
  projectId: string;
  title?: string;
  shortDescription?: string;
  readme?: string;
  closed?: boolean;
  public?: boolean;
}

export interface DeleteProjectV2Input {
  projectId: string;
}

export interface AddProjectV2DraftIssueInput {
  projectId: string;
  title: string;
  body?: string;
  assigneeIds?: string[];
}

export interface AddProjectV2ItemByIdInput {
  projectId: string;
  contentId: string;
}

export interface UpdateProjectV2ItemFieldValueInput {
  projectId: string;
  itemId: string;
  fieldId: string;
  value: ProjectV2FieldValue;
}

export interface ProjectV2FieldValue {
  text?: string;
  number?: number;
  date?: string;
  singleSelectOptionId?: string;
  iterationId?: string;
}

export interface DeleteProjectV2ItemInput {
  projectId: string;
  itemId: string;
}

export interface CreateProjectV2FieldInput {
  projectId: string;
  dataType: ProjectV2CustomFieldType;
  name: string;
  singleSelectOptions?: SingleSelectOptionInput[];
}

export type ProjectV2CustomFieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'SINGLE_SELECT' | 'ITERATION';

export interface SingleSelectOptionInput {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateProjectV2FieldInput {
  fieldId: string;
  name?: string;
}

export interface DeleteProjectV2FieldInput {
  fieldId: string;
}

// Mutation Response Types
export interface CreateProjectV2Payload {
  projectV2: ProjectV2 | null;
}

export interface UpdateProjectV2Payload {
  projectV2: ProjectV2 | null;
}

export interface DeleteProjectV2Payload {
  projectV2: { id: string } | null;
}

export interface AddProjectV2DraftIssuePayload {
  projectItem: ProjectV2Item | null;
}

export interface AddProjectV2ItemByIdPayload {
  item: ProjectV2Item | null;
}

export interface UpdateProjectV2ItemFieldValuePayload {
  projectV2Item: ProjectV2Item | null;
}

export interface DeleteProjectV2ItemPayload {
  deletedItemId: string | null;
}

export interface CreateProjectV2FieldPayload {
  projectV2Field: ProjectV2FieldConfiguration | null;
}

export interface UpdateProjectV2FieldPayload {
  projectV2Field: ProjectV2FieldConfiguration | null;
}

export interface DeleteProjectV2FieldPayload {
  projectV2Field: { id: string } | null;
}
