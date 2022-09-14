## Dato CMS Feature Table Plugin

Built on top of a [community table plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-table-editor?s=table) to accommodate different table styles.

Each cell has the option to be either a rich text or checkbox field. However, the first column will always be set to rich text unless a column header is entered.

A row can optionally be collapsible by selecting "Make row collapsible" in the row's dropdown settings. This will add the row's index to the `collapsibleRows` JSON field.

Column headers can be hidden by clicking "Hide column headers button". This will change the `hasColumnHeaders` JSON field to `false`. However, the JSON output will still include column names as that is how the data is organized.

### Usage:

Use this plugin as the presentation in any JSON field.

### Output

```json
{
  "collapsibleRows": [],
  "hasColumnHeaders": true,
  "columns": ["", "Col 1", "Col 2"],
  "data": [
    {
      "": { "heading": "Row 1", "content": "" },
      "Col 1": {
        "heading": "Sample Rich Text Heading",
        "content": "Sample Rich Text Content"
      },
      "Col 2": { "heading": "Sample Rich Text Heading", "content": "" }
    },
    {
      "": { "heading": "Row 2", "content": "" },
      "Col 1": false,
      "Col 2": true
    }
  ]
}
```
