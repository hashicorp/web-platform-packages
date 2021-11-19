import anchorLinks from './plugins/anchor-links/index.js'
import jumpToSection from './plugins/jump-to-section/index.js'
import paragraphCustomAlerts from './plugins/paragraph-custom-alerts/index.js'
import typography from './plugins/typography/index.js'
import includeMarkdown from './plugins/include-markdown/index.js'

// for easy use of everything at the same time
export default function allPlugins({
  anchorLinks: anchorLinksOptions,

  typography: typographyOptions,
  includeMarkdown: includeMarkdownOptions,
} = {}) {
  return [
    [includeMarkdown, includeMarkdownOptions],
    [anchorLinks, anchorLinksOptions],
    jumpToSection,
    paragraphCustomAlerts,
    [typography, typographyOptions],
  ]
}
