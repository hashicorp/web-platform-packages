/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/// <reference types="@segment/analytics-next" />

declare module '@next/bundle-analyzer'
declare module 'next-optimized-images'
declare module 'next-transpile-modules'

declare module '@hashicorp/remark-plugins'
declare module '@hashicorp/react-consent-manager'

declare module 'framer-motion/dist/es/motion/features/layout'
declare module 'framer-motion/dist/es/projection/node/HTMLProjectionNode'

declare module '*.graphql'

declare module '@mapbox/rehype-prism'

declare module '*.css'

declare module '*.svg'
declare module '*.svg?include'

/**
 * Alias any so we can assess and track usage of any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $TSFixMe = any

/**
 * Infer the promise value type from a PromiseLike object
 */
type ThenType<T> = T extends PromiseLike<infer U> ? U : T
