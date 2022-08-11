## Dato CMS Complex Table Plugin

Built on top of a [table community plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-table-editor?s=table) to accommodate different types of editable cells including checkboxes and rich text. 

### Testing:

`cd packages/dato-table-plugin`

`npm start`

#### In Dato CMS:

Add plugin

Choose Create New Plugin

Enter plugin name (Features Table)

Enter entry point url `https://localhost:3000`

In model, add new JSON field and select your plugin name Field Editor field in the Presentation tab

See [Dato documentation](https://www.datocms.com/docs/plugin-sdk/build-your-first-plugin) for more information