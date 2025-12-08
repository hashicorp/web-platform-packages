/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'

export async function doesFileExist(file: string): Promise<boolean> {
  const absolutePath = path.join(process.cwd(), file)

  try {
    const stat = await fs.promises.lstat(absolutePath)
    return stat.isFile()
  } catch {
    return false
  }
}
