/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Meta500 = {
  status_code: Meta500.status_code
  status_text: Meta500.status_text
}

export namespace Meta500 {
  export enum status_code {
    '_500' = 500,
  }

  export enum status_text {
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
  }
}
