import anchorLinks from './plugins/anchor-links/index.js'
import paragraphCustomAlerts from './plugins/paragraph-custom-alerts/index.js'
import typography from './plugins/typography/index.js'
import includeMarkdown from './plugins/include-markdown/index.js'

const allPlugins = ({
  anchorLinks: anchorLinksOptions,
  typography: typographyOptions,
  includeMarkdown: includeMarkdownOptions,
} = {}) => [
  [includeMarkdown, includeMarkdownOptions],
  [anchorLinks, anchorLinksOptions],
  paragraphCustomAlerts,
  [typography, typographyOptions],
]

export { anchorLinks, paragraphCustomAlerts, typography, includeMarkdown }
export default allPlugins
