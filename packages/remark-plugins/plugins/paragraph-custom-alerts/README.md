# Paragraph Custom Alerts

This plugin allows paragraphs to be "tagged" by custom symbols, effecting their final render.

| Symbol | Meaning   |
| ------ | --------- |
| `=>`   | `success` |
| `->`   | `info`    |
| `~>`   | `warning` |
| `!>`   | `danger`  |

### Input:

```mdx
Read below for more information...

!> Here be dragons. Proceed with caution!

=> You are victorious! Great victory!
```

### Output:

```html
<p>Read below for more information...</p>
<div class="alert alert-danger" role="alert">
  <p>Here be dragons. Proceed with caution!</p>
</div>
<div class="alert alert-success" role="alert">
  <p>You are victorious! Great victory!</p>
</div>
```
