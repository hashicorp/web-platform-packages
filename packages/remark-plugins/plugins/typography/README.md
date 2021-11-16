# Heading Type Styles

We use a set of global classes for type styling at HashiCorp. This plugin adds type styles to the appropriate elements so that content looks as intended within rendered markdown blocks without duplicating or extending CSS.

### Input

```mdx
# Uses

Here are some uses...

## Another title

Here is some more stuff...
```

### Output

```jsx
<h1 className='g-type-display-2'>Uses</h1>

<p className='g-type-long-body'>Here are some uses...</p>

<h2 className='g-type-display-3'>Another title</h2>

<p className='g-type-long-body'>Here is some more stuff...</p>
```

### Custom Class Mapping

In rare cases, we may want to map custom `class` attributes onto specific elements. Currently, this plugin supports an `options` object, and `options.map` provides this functionality.

Here is an imagined use case where all possible elements have custom `class` attributes. Any one of these elements can be omitted from the map, and it will fall back to our default `class` for that element.

```js
const options = {
  map: {
    h1: 'custom-1',
    h2: 'custom-2',
    h3: 'custom-3',
    h4: 'custom-4',
    h5: 'custom-5',
    h6: 'custom-6',
    p: 'custom-paragraph',
    li: 'custom-list-item',
  },
}
// example use with `mdx`
const output = mdx.sync(fileContents, {
  remarkPlugins: [[typographyPlugin, options]],
})
```

With this configuration, and the same input as the previous example, we would expect the following output:

```jsx
<h1 className='custom-1'>Uses</h1>

<p className='custom-paragraph'>Here are some uses...</p>

<h2 className='custom-2'>Another title</h2>

<p className='custom-paragraph'>Here is some more stuff...</p>
```
