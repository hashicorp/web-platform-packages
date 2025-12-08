/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to be capitalized
 */
export default function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
