/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { RenderModalCtx } from 'datocms-plugin-sdk'
import { Button, Canvas } from 'datocms-react-ui'
import { useState } from 'react'
import { Empty } from '../../components/Empty'
import TableEditor from '../../components/TableEditor'
import { Value } from '../../types'
import s from './style.module.css'

type Props = {
  ctx: RenderModalCtx
}

export default function Modal({ ctx }: Props) {
  const [value, setValue] = useState<Value | null>(
    ctx.parameters.value as Value
  )

  const handleClose = () => {
    ctx.resolve('abort')
  }

  const handleSave = () => {
    ctx.resolve(value)
  }

  function Actions() {
    return (
      <div className={s.bar}>
        <Button onClick={handleClose}>Cancel</Button>{' '}
        <div className={s.barSpacer} />
        <Button buttonType="primary" onClick={handleSave}>
          Save and close
        </Button>
      </div>
    )
  }

  return (
    <Canvas ctx={ctx}>
      <Actions />
      {value === null ? (
        <Empty onChange={setValue} />
      ) : (
        <TableEditor value={value} onChange={setValue} />
      )}
      <Actions />
    </Canvas>
  )
}
