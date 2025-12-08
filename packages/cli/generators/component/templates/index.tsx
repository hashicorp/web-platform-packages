/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
import { <%= componentClass %>Props } from './types'

export default function <%= componentClass %>({}: <%= componentClass %>Props) {
  return (
    <div className={s.root}'>
      <%= component %>
    </div>
  )
}
