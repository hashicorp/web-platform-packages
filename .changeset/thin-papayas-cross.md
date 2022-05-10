---
'@hashicorp/platform-packer-plugins': minor
---

Resolves all latest version properties to specific tags as a first step in resolving plugin docs.

This change fixes an issue where changes to remote plugin releases would often break builds due to not being able to fall back to source.zip for latest versions.

However, it introduces the need for a GITHUB_TOKEN when running local preview with Packer. Note that a specific token is not required, any valid GitHub user's Personal Access Token can be used.
