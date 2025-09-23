/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export default function layout(frontMatter) {
  return function layoutInternal({ children }) {
    return (
      <div className="page">
        <p>Example Layout Template</p>
        <h1>{frontMatter.page_title}</h1>
        {children}
      </div>
    )
  }
}
