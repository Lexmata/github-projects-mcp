# Tools Reference

Complete reference for all 17 tools provided by the GitHub Projects MCP Server.

## Project Tools

### list_projects

List GitHub Projects V2 for a user or organization.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| owner | string | Yes | The username or organization name |
| ownerType | 'user' \| 'organization' | Yes | Whether the owner is a user or organization |
| first | number | No | Number of projects to return (default: 20, max: 100) |
| after | string | No | Cursor for pagination |

**Example:**
```json
{
  "owner": "octocat",
  "ownerType": "user",
  "first": 10
}
```

**Response:**
```json
{
  "projects": [
    {
      "id": "PVT_kwDOA...",
      "number": 1,
      "title": "My Project",
      "shortDescription": "A sample project",
      "public": true,
      "closed": false,
      "url": "https://github.com/users/octocat/projects/1"
    }
  ],
  "totalCount": 5,
  "hasNextPage": false,
  "endCursor": null
}
```

---

### get_project

Get detailed information about a specific GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| owner | string | Yes | The username or organization name |
| ownerType | 'user' \| 'organization' | Yes | Whether the owner is a user or organization |
| projectNumber | number | Yes | The project number |

**Example:**
```json
{
  "owner": "octocat",
  "ownerType": "user",
  "projectNumber": 1
}
```

---

### create_project

Create a new GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| owner | string | Yes | The username or organization name |
| ownerType | 'user' \| 'organization' | Yes | Whether the owner is a user or organization |
| title | string | Yes | The title of the project |

**Example:**
```json
{
  "owner": "octocat",
  "ownerType": "user",
  "title": "Sprint Planning Q1"
}
```

---

### update_project

Update a GitHub Project V2 (title, description, readme, visibility, or closed status).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| title | string | No | New title for the project |
| shortDescription | string | No | New short description |
| readme | string | No | New readme content |
| closed | boolean | No | Whether to close the project |
| public | boolean | No | Whether the project is public |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "title": "Updated Project Title",
  "shortDescription": "New description"
}
```

---

### delete_project

Delete a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project to delete |

**Example:**
```json
{
  "projectId": "PVT_kwDOA..."
}
```

---

## Item Tools

### list_project_items

List all items (issues, pull requests, draft issues) in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| first | number | No | Number of items to return (default: 20, max: 100) |
| after | string | No | Cursor for pagination |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "first": 50
}
```

---

### get_project_item

Get detailed information about a specific item in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| itemId | string | Yes | The global ID of the item |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "itemId": "PVTI_lADOA..."
}
```

---

### add_draft_issue

Add a new draft issue to a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| title | string | Yes | Title of the draft issue |
| body | string | No | Body content of the draft issue |
| assigneeIds | string[] | No | Array of user IDs to assign |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "title": "Implement login feature",
  "body": "Add OAuth login support"
}
```

---

### add_existing_issue

Add an existing issue or pull request to a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| contentId | string | Yes | The global ID of the issue or pull request to add |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "contentId": "I_kwDOA..."
}
```

---

### update_item_field

Update a field value on an item in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| itemId | string | Yes | The global ID of the item |
| fieldId | string | Yes | The global ID of the field |
| value | object | Yes | The value to set (see below) |

**Value Object:**
| Property | Type | Description |
|----------|------|-------------|
| text | string | Text value for TEXT fields |
| number | number | Number value for NUMBER fields |
| date | string | Date value (YYYY-MM-DD) for DATE fields |
| singleSelectOptionId | string | Option ID for SINGLE_SELECT fields |
| iterationId | string | Iteration ID for ITERATION fields |

**Example (Text Field):**
```json
{
  "projectId": "PVT_kwDOA...",
  "itemId": "PVTI_lADOA...",
  "fieldId": "PVTF_lADOA...",
  "value": { "text": "High priority" }
}
```

**Example (Single Select):**
```json
{
  "projectId": "PVT_kwDOA...",
  "itemId": "PVTI_lADOA...",
  "fieldId": "PVTSSF_lADOA...",
  "value": { "singleSelectOptionId": "47fc9ee4" }
}
```

---

### remove_project_item

Remove an item from a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| itemId | string | Yes | The global ID of the item to remove |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "itemId": "PVTI_lADOA..."
}
```

---

## Field Tools

### list_project_fields

List all fields in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| first | number | No | Number of fields to return (default: 50) |
| after | string | No | Cursor for pagination |

**Example:**
```json
{
  "projectId": "PVT_kwDOA..."
}
```

---

### create_field

Create a new custom field in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| name | string | Yes | Name of the field |
| dataType | string | Yes | Type of field: TEXT, NUMBER, DATE, SINGLE_SELECT, or ITERATION |
| singleSelectOptions | array | No | Options for SINGLE_SELECT fields |

**Single Select Option:**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Option name |
| color | string | Yes | Option color (e.g., RED, GREEN, BLUE) |
| description | string | No | Option description |

**Example (Text Field):**
```json
{
  "projectId": "PVT_kwDOA...",
  "name": "Notes",
  "dataType": "TEXT"
}
```

**Example (Single Select):**
```json
{
  "projectId": "PVT_kwDOA...",
  "name": "Priority",
  "dataType": "SINGLE_SELECT",
  "singleSelectOptions": [
    { "name": "High", "color": "RED" },
    { "name": "Medium", "color": "YELLOW" },
    { "name": "Low", "color": "GREEN" }
  ]
}
```

---

### update_field

Update a field in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| fieldId | string | Yes | The global ID of the field |
| name | string | Yes | New name for the field |

**Example:**
```json
{
  "fieldId": "PVTF_lADOA...",
  "name": "Updated Field Name"
}
```

---

### delete_field

Delete a custom field from a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| fieldId | string | Yes | The global ID of the field to delete |

**Example:**
```json
{
  "fieldId": "PVTF_lADOA..."
}
```

---

## View Tools

### list_project_views

List all views in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| first | number | No | Number of views to return (default: 20) |
| after | string | No | Cursor for pagination |

**Example:**
```json
{
  "projectId": "PVT_kwDOA..."
}
```

---

### get_project_view

Get detailed information about a specific view in a GitHub Project V2.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| projectId | string | Yes | The global ID of the project |
| viewNumber | number | Yes | The view number |

**Example:**
```json
{
  "projectId": "PVT_kwDOA...",
  "viewNumber": 1
}
```

**Response:**
```json
{
  "view": {
    "id": "PV_kwHOA...",
    "name": "Board",
    "number": 1,
    "layout": "BOARD_LAYOUT",
    "filter": "status:open"
  }
}
```

## Error Responses

All tools return errors in a consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": { }
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input parameters
- `PROJECT_NOT_FOUND` - Project does not exist or is not accessible
- `ITEM_NOT_FOUND` - Item does not exist
- `VIEW_NOT_FOUND` - View does not exist
- `USER_NOT_FOUND` - User does not exist
- `ORG_NOT_FOUND` - Organization does not exist
- `CREATE_FAILED` - Failed to create resource
- `UPDATE_FAILED` - Failed to update resource
- `DELETE_FAILED` - Failed to delete resource
