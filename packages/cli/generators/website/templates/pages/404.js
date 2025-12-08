/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'next/link'
import { useErrorPageAnalytics } from 'packages/analytics'

export default function NotFound() {
  useErrorPageAnalytics(404)

  return (
    <div id="p-404">
      <h1>Page Not Found</h1>
      <p>
        We&apos;re sorry but we can&apos;t find the page you&apos;re looking
        for.
      </p>
      <p>
        <Link href="/">
          <a>Back to Home</a>
        </Link>
      </p>
    </div>
  )
}
