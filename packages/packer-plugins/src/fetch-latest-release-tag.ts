import fetch from 'isomorphic-unfetch'

/**
 * Given a repo string, in the format "<owner>/<repo-name>",
 * Return a string representing the latest release tag in that repo,
 * or false if the latest tag cannot be resolved.
 */
export async function fetchLatestReleaseTag(repo: string): Promise<string> {
  const latestReleaseUrl = `https://github.com/${repo}/releases/latest`
  const res = await fetch(latestReleaseUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  })

  if (res.status === 429) {
    throw new Error(
      "When loading remote plugin data, GitHub API rate limit exceeded. Double check that a `GITHUB_TOKEN` environment variable is set. All Packer plugin repositories are public, so any GitHub user's personal access token will work as the `GITHUB_TOKEN` environment variable."
    )
  } else if (res.status !== 200) {
    throw new Error(
      `When loading remote plugin data, Failed to fetch ${latestReleaseUrl}. Details: ${JSON.stringify(
        { status: res.status, statusText: res.statusText },
        null,
        2
      )}`
    )
  }

  const matches = res.url.match(/tag\/(.*)/)

  if (!matches) {
    throw new Error(
      `When loading remote plugin data, failed to parse latest tag from  ${latestReleaseUrl}. Details: ${JSON.stringify(
        { resolvedUrl: res.url },
        null,
        2
      )}`
    )
  }

  return matches[1]
}
