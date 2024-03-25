/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta422 = {
  status_code: Meta422.status_code
  status_text: Meta422.status_text
}

export namespace Meta422 {
  export enum status_code {
    '_422' = 422,
  }

  export enum status_text {
    UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  }
}
