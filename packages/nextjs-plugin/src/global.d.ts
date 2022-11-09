/// <reference types="@hashicorp/platform-types" />

declare module '@hashicorp/next-optimized-images'

// Manually add the transpilePackages property to support Next v13
declare module 'next' {
  interface ExperimentalConfig {
    experimental: {
      transpilePackages?: string[]
    }
  }
}
