const TEST_URL_ORIGIN = 'https://test.com'
const LEARN_HOSTNAME = 'learn.hashicorp.com'
const DEV_DOT_HOSTNAME = 'developer.hashicorp.com'

const PRODUCT_SLUGS_TO_HOST_NAMES = {
  boundary: 'boundaryproject.io',
  consul: 'consul.io',
  hcp: 'cloud.hashicorp.com',
  nomad: 'nomadproject.io',
  packer: 'packer.io',
  terraform: 'terraform.io',
  vagrant: 'vagrantup.com',
  vault: 'vaultproject.io',
  waypoint: 'waypointproject.io',
}

// TODO(brkalow): it would be good to have this come from a shared source
const PRODUCT_SLUGS_TO_BASE_PATHS = {
  boundary: ['docs', 'api-docs', 'downloads'],
  consul: ['docs', 'api-docs', 'commands', 'downloads'],
  hcp: ['docs', 'api-docs'],
  nomad: ['docs', 'api-docs', 'plugins', 'tools', 'intro', 'downloads'],
  packer: ['docs', 'guides', 'intro', 'plugins', 'downloads'],
  terraform: [
    'cdktf',
    'cli',
    'cloud-docs',
    'cloud-docs/agents',
    'docs',
    'enterprise',
    'internals',
    'intro',
    'language',
    'plugin',
    'plugin/framework',
    'plugin/log',
    'plugin/mux',
    'plugin/sdkv2',
    'registry',
    'downloads',
  ],
  vagrant: ['docs', 'intro', 'vagrant-cloud', 'vmware', 'downloads'],
  vault: ['docs', 'api-docs', 'intro', 'downloads', 'downloads'],
  waypoint: ['commands', 'docs', 'plugins', 'downloads'],
}

const KNOWN_DOCS_BASE_PATHS = Array.from(
  // this ensures the values are unique
  new Set(
    Object.values(PRODUCT_SLUGS_TO_BASE_PATHS)
      .flat()
      .map((basePath) => `/${basePath}`)
  )
)

const PRODUCT_SLUG_PATH_PATTERN = new RegExp(
  `^/(${Object.keys(PRODUCT_SLUGS_TO_HOST_NAMES).join('|')})`
)

/**
 * Configurable via a contentType config option (`"docs" | "tutorials"`). Assumed to be `"docs"` unless otherwise specified.
 *
 * @type {import('../types.js').ConformanceRuleBase}
 * */
export default {
  id: 'ensure-valid-link-format',
  type: 'content',
  description:
    'Ensures that internal links conform to the path structure of the Developer platform.',
  executor: {
    contentFile(file, context) {
      file.visit(['link', 'definition'], (node) => {
        const urlObject = new URL(node.url, TEST_URL_ORIGIN)
        const { hostname, pathname, search = '', hash = '', origin } = urlObject
        const isRelativePath = origin === TEST_URL_ORIGIN

        // Error if we detect folder-relative links
        if (
          node.url.startsWith('.') ||
          // Handles folder-relative links such as "some/nested/folder". These can be problematic when trying to validate the correct destination. It's easier for us to enforce that all links are full paths.
          (!node.url.startsWith('/') && isRelativePath)
        ) {
          context.report(
            `Unexpected folder-relative link found: ${node.url}. Ensure this link is an absolute Developer path.`,
            file,
            node
          )
          return
        }

        // Check for .io hostname
        const dotIoLinkProductSlug = Object.keys(
          PRODUCT_SLUGS_TO_HOST_NAMES
        ).find((productSlug) => {
          return (
            hostname === PRODUCT_SLUGS_TO_HOST_NAMES[productSlug] ||
            hostname === `www.${PRODUCT_SLUGS_TO_HOST_NAMES[productSlug]}`
          )
        })

        if (dotIoLinkProductSlug) {
          const devDotBasePaths =
            PRODUCT_SLUGS_TO_BASE_PATHS[dotIoLinkProductSlug]
          const isDevDotBasePath = devDotBasePaths.some((devDotBasePath) => {
            return pathname.startsWith(`/${devDotBasePath}`)
          })
          if (isDevDotBasePath) {
            context.report(
              `Unexpected link to documentation on \`${
                PRODUCT_SLUGS_TO_HOST_NAMES[dotIoLinkProductSlug]
              }\`: \`${
                node.url
              }\`. Try replacing it with \`${`/${dotIoLinkProductSlug}${
                pathname === '/' ? '' : pathname
              }`}\``,
              file,
              node
            )
          }
        }

        // Check for learn hostname
        if (hostname === LEARN_HOSTNAME) {
          context.report(
            `Unexpected link to \`learn.hashicorp.com\`: \`${node.url}\`. Replace it with a relative path internal to Developer with the format: \`/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}\`.`,
            file,
            node
          )
        }

        // Check for developer hostname
        if (hostname === DEV_DOT_HOSTNAME) {
          context.report(
            `Unexpected fully-qualified link to \`developer.hashicorp.com\`: \`${node.url}\`. Replace with a relative path internal to Developer. Possibly: \`${pathname}${search}${hash}\`.`,
            file,
            node
          )
        }

        // handle product-relative paths
        if (
          isRelativePath &&
          // ignore any paths starting with /{productSlug}
          !pathname.match(PRODUCT_SLUG_PATH_PATTERN) &&
          // check paths that start with a known docs base path
          KNOWN_DOCS_BASE_PATHS.some((basePath) =>
            pathname.startsWith(basePath)
          )
        ) {
          context.report(
            `Unexpected product-relative link: \`${node.url}\`. Ensure that relative links are fully-qualified Developer paths: \`/{productSlug}${pathname}\``,
            file,
            node
          )
        }

        // if we're running in the context of tutorials, check for specific old link formats
        if (context.config?.contentType === 'tutorials') {
          // Check if old search link (starts with "/search")
          if (
            pathname.startsWith('/search') &&
            (hostname === LEARN_HOSTNAME || isRelativePath)
          ) {
            context.report(
              `Old Learn search page link: \`${node.url}\`. Replace it with \`/tutorials/library${search}${hash}\`.`,
              file,
              node
            )
          }

          // Check if one of old collection links
          if (
            pathname.startsWith('/collections/well-architected-framework') ||
            pathname.startsWith('/collections/onboarding')
          ) {
            context.report(
              `Old WAF/onboarding collection page link: \`${node.url}\`. WAF/onboarding collection links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}\``,
              file,
              node
            )
          } else if (pathname.startsWith('/collections')) {
            context.report(
              `Old collection page link: \`${node.url}\`. Collections links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}\`.`,
              file,
              node
            )
          }

          // Check if one of old tutorial links
          if (
            pathname.startsWith('/tutorials/well-architected-framework') ||
            pathname.startsWith('/tutorials/onboarding')
          ) {
            context.report(
              `Old WAF/onboarding tutorials page link: \`${node.url}\`. WAF/onboarding tutorial links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}/{tutorialSlug}\``,
              file,
              node
            )
          } else if (pathname.startsWith('/tutorials')) {
            context.report(
              `Old tutorial page link: \`${node.url}\`. Tutorials links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}\`.`,
              file,
              node
            )
          }
        }
      })
    },
  },
}
