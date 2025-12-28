# Examples

This guide provides practical examples of using the GitHub Projects MCP Server with Claude.

## Project Management

### List All Your Projects

**Prompt:**
> "Show me all my GitHub projects"

**What happens:**
1. Claude calls `list_projects` with your username
2. Returns a list of all your projects with titles, descriptions, and URLs

### Get Project Details

**Prompt:**
> "Get details for my project number 3"

**What happens:**
1. Claude calls `get_project` with projectNumber: 3
2. Returns full project details including README, visibility, and status

### Create a New Project

**Prompt:**
> "Create a new GitHub project called 'Q1 2024 Roadmap' for my organization acme-corp"

**What happens:**
1. Claude calls `create_project` with owner: "acme-corp", ownerType: "organization", title: "Q1 2024 Roadmap"
2. Returns the new project details including its ID and URL

### Update Project Settings

**Prompt:**
> "Update my roadmap project to add a description saying 'Planning for Q1 2024' and make it public"

**What happens:**
1. Claude calls `update_project` with the project ID, shortDescription, and public: true
2. Returns the updated project

### Close a Project

**Prompt:**
> "Close my old sprint project"

**What happens:**
1. Claude calls `update_project` with closed: true
2. The project is archived

## Item Management

### List Project Items

**Prompt:**
> "Show me all items in my Sprint Planning project"

**What happens:**
1. Claude calls `list_project_items` with the project ID
2. Returns all issues, PRs, and draft issues in the project

### Add a Draft Issue

**Prompt:**
> "Add a new task to my project: 'Implement user authentication' with description 'Add OAuth2 support for Google and GitHub login'"

**What happens:**
1. Claude calls `add_draft_issue` with the project ID, title, and body
2. Returns the new draft issue

### Add an Existing Issue to Project

**Prompt:**
> "Add issue #42 from my-repo to my Sprint Planning project"

**What happens:**
1. Claude first needs to get the issue's node ID
2. Then calls `add_existing_issue` with the project ID and content ID
3. Returns the added item

### Update Item Status

**Prompt:**
> "Set the status of the authentication task to 'In Progress'"

**What happens:**
1. Claude calls `list_project_fields` to find the Status field ID
2. Gets the field options to find "In Progress" option ID
3. Calls `update_item_field` with the item ID, field ID, and option ID
4. Returns the updated item

### Remove an Item

**Prompt:**
> "Remove the completed authentication task from my project"

**What happens:**
1. Claude calls `remove_project_item` with the project and item IDs
2. The item is removed from the project (but the underlying issue remains)

## Field Management

### View Project Fields

**Prompt:**
> "What fields are in my Sprint Planning project?"

**What happens:**
1. Claude calls `list_project_fields` with the project ID
2. Returns all fields including Status, Priority, Estimate, etc.

### Create a Priority Field

**Prompt:**
> "Add a Priority field to my project with options High, Medium, and Low"

**What happens:**
1. Claude calls `create_field` with dataType: "SINGLE_SELECT" and options
2. Returns the new field with option IDs

### Create a Story Points Field

**Prompt:**
> "Add a numeric Story Points field to track estimates"

**What happens:**
1. Claude calls `create_field` with name: "Story Points", dataType: "NUMBER"
2. Returns the new field

### Rename a Field

**Prompt:**
> "Rename the 'Points' field to 'Story Points'"

**What happens:**
1. Claude calls `update_field` with the new name
2. Returns the updated field

### Delete a Field

**Prompt:**
> "Remove the old Priority field from my project"

**What happens:**
1. Claude calls `delete_field` with the field ID
2. The field is deleted (existing values are removed from items)

## View Management

### List Project Views

**Prompt:**
> "What views are available in my project?"

**What happens:**
1. Claude calls `list_project_views` with the project ID
2. Returns all views with their layouts (Table, Board, Roadmap)

### Get View Details

**Prompt:**
> "Show me the configuration of my Board view"

**What happens:**
1. Claude calls `get_project_view` with the project ID and view number
2. Returns view details including layout type and filter settings

## Common Workflows

### Sprint Planning Workflow

**Prompt:**
> "Help me set up a sprint planning project for my team"

Claude might:
1. Create a new project
2. Add custom fields: Status, Priority, Story Points, Sprint
3. Create initial items from draft issues
4. Set up the board view

### Project Status Report

**Prompt:**
> "Give me a status report on my current sprint project"

Claude might:
1. List all project items
2. Summarize items by status
3. Calculate total story points
4. Identify blockers or overdue items

### Bulk Item Updates

**Prompt:**
> "Set all items in the Backlog to Low priority"

Claude might:
1. List all project items
2. Filter for items with Status = Backlog
3. Update each item's priority field

### Project Cleanup

**Prompt:**
> "Remove all completed items from my project"

Claude might:
1. List all project items
2. Filter for items with Status = Done
3. Remove each completed item from the project

## Error Handling

### Project Not Found

**Prompt:**
> "Show me project number 999"

**Response:**
```json
{
  "error": "PROJECT_NOT_FOUND",
  "message": "Project #999 not found for user octocat"
}
```

### Permission Denied

**Prompt:**
> "Delete the company-wide project"

**Response:**
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Resource not accessible by integration"
}
```

### Invalid Input

**Prompt:**
> "Create a project with no title"

**Response:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "details": [
    {
      "path": ["title"],
      "message": "Required"
    }
  ]
}
```

## Tips for Best Results

1. **Be specific about ownership**: Mention whether you're referring to user or organization projects
2. **Use project numbers**: When referencing existing projects, use their number (visible in the URL)
3. **Provide context**: Tell Claude what you want to achieve, not just what command to run
4. **Batch operations**: Ask Claude to perform multiple related operations in sequence
5. **Verify before deleting**: Ask Claude to confirm what will be deleted before proceeding
