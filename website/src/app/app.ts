import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  tools = [
    { name: 'list_projects', category: 'Projects' },
    { name: 'get_project', category: 'Projects' },
    { name: 'create_project', category: 'Projects' },
    { name: 'update_project', category: 'Projects' },
    { name: 'delete_project', category: 'Projects' },
    { name: 'list_project_items', category: 'Items' },
    { name: 'get_project_item', category: 'Items' },
    { name: 'add_draft_issue', category: 'Items' },
    { name: 'add_existing_issue', category: 'Items' },
    { name: 'update_item_field', category: 'Items' },
    { name: 'remove_project_item', category: 'Items' },
    { name: 'list_project_fields', category: 'Fields' },
    { name: 'create_field', category: 'Fields' },
    { name: 'update_field', category: 'Fields' },
    { name: 'delete_field', category: 'Fields' },
    { name: 'list_project_views', category: 'Views' },
    { name: 'get_project_view', category: 'Views' },
  ];

  configExample = `{
  "mcpServers": {
    "github-projects": {
      "command": "npx",
      "args": ["@lexmata/github-projects-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token"
      }
    }
  }
}`;

  currentYear = new Date().getFullYear();
}
