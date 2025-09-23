/**
 * Copyright (c) HashiCorp, Inc.
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
