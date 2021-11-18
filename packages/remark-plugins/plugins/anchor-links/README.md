# Anchor Links

This plugin processes headings and inline code blocks at the beginning of a list item to generate a slug and adds a **permalink** element and an invisible **target** element. These two elements ensure that users are able to click a link next to the heading, or click on the inline code block to quickly get an anchor link directly to the corresponding section, and that developers are able to customize the position that the section appears when that anchor link is visited, respectively.

## Input:

```mdx
# First Level Heading

- list item
- `code_block` - with text explanation

Content here...
```

## Output:

```html
<h1>
  <a
    href="#first-level-heading"
    class="__permalink-h"
    aria-label="first level heading permalink"
    >»</a
  >
  <a id="first-level-heading" class="__target-h" aria-hidden="true"></a>
  First Level Heading
</h1>

<ul>
  <li>list item</li>
  <li>
    <a id="#code_block" class="__target-lic" aria-hidden="true"></a>
    <a
      href="#code_block"
      class="__permalink-lic"
      aria-label="code_block permalink"
    >
      <code>code_block</code>
    </a>
    - with text explanation
  </li>
</ul>

<p>Content here...</p>
```

Since the `__target` element carries the `id` rather than the headline, it can be positioned independently to pad the headline off the top of the page if necessary, which is the case any time we use a "sticky" navigation. Also worth noting is that the `__target` and `__permalink` elements carry a category identifier after their classname, `h` for "heading" and `lic` for "list inline code", in order to make styling super clear and avoid any chance for conflicts.

## Anchor Link Aliases

This plugin also adds the ability to add **anchor link aliases** via markdown directly. Aliases give authors the ability to specify additional anchors that they would like to link to an existing anchor link. Here's an example of how this might look:

```md
# Headline ((#alias, #alias-2))

- `code_block` ((#alias-3)) further text, etc
```

This markup would ensure that `#alias` and `#alias-2` also link to `#headline`, and that `#alias-3` also links to `#code_block`. Any number of aliases can be specified as long as they are in this exact format - for a single alias `((#slug))`, or for multiple, `((#slug, #slug2, #slug3))` etc. Anything following a headline or initial inline code element within a list item will be used as aliases and removed from the output. If you are using this syntax and you still see it in the output, this typically means there was an error in the syntax used.

This feature is intended to be used **very sparingly**. It is a nonstandard markdown feature which we do our best to avoid as an organization. Let's walk through a couple situations where this syntax could be used and examine when it's appropriate.

- You have written a headline, and would like to add a custom "vanity" permalink, to ensure that it's short and memorable.

  🚫 **This is not an appropriate use on an anchor link alias.** As a custom, nonstandard markdown feature, we need to use this functionality sparingly, only when it is essential. This scenario does not qualify as essential.

- You are changing an existing headline that is linked to internally, which you know will change its permalink slug. It's quicker and easier to add an alias than to find-and-replace all the internal links to the anchor.

  🚫 **This is not an appropriate use of an anchor link alias.** Any time a headline changes, internal links to its permalink should be manually updated to its new permalink using find-and-replace.

- You are changing an existing headline, and there are many external links to this headline which we are unable to fix.

  ✅ **This is the only appropriate scenario to be using anchor link aliases.** We track statistics on all anchor links via web analytics - if a headline's text must be changed, ask your manager and/or the digital dev team to check the analytics dashboard and see if there is significant externally-driven traffic to its permalink. If so, an anchor link alias should be used to avoid breaking users' expectations.

## Options

- `compatibilitySlug` _(function, optional)_ - if present, will generate an slug using a custom slug creation algorithm and add it as an additional `__target` element. Accepts a function with the following signature `fn(text: string)`. The `text` argument is the headline/inline code text, if the `compatibilitySlug` function generates an identical slug as the default, it will not be added at all.

  > **NOTE:** Be conscious of duplicate tracking with your compatibility function. If it needs to keep track of existing slugs on the page to avoid duplicates, it must implement that functionality on its own. Default slugs are not exposed to the `compatibilitySlug` function because this offers a footgun that can easily break compatibility. The `compatibilitySlug` function should operate entirely in its own sphere -- if it happens to generate a duplicate slug, the plugin itself will remove it as compatibility isn't necessary in that instance.

- `headings` _(array, optional)_ - if present, data about the headings being processed will be pushed to the array. Each element is an object with the following properties:

  - `aliases`: a string array containing all of the given [anchor link aliases](#anchor-link-aliases) for a heading
  - `level`: the level of a heading (e.g. an `<h1>` has a level of 1 and an `<h2>` has a level of 2)
  - `permalinkSlug`: the slug used in the permalink element
  - `slug`: the slug generated from a heading's text
  - `title`: the content of a heading in plain text (excluding aliases)

- `listWithInlineCodePrefix` _(string, optional)_ - if present, will append a string to the beginning of each instance where lists with inline code at the beginning get an anchor link. This is also provided for compatibility reasons, as we previously used a separate plugin for lists with inline code that appended an `inlinecode` prefix to avoid conflicts.
