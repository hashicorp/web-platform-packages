export interface PluginManifestEntry {
  title: string
  path: string
  repo: string
  version: string | 'latest'
  pluginTier: 'community' | 'official'
  archived?: boolean
  isHcpPackerReady?: boolean
  sourceBranch?: string
  zipFile?: string
}

export interface PluginFile {
  title: string
  path: string
  filePath: string
  fileString: string
  sourceUrl: string
}

export interface EnrichedPluginManifestEntry extends PluginManifestEntry {
  files: PluginFile[]
}

export interface RawPluginFile {
  filePath: string
  fileString: string
}
