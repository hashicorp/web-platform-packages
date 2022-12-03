import createFetch from '@vercel/fetch'
import * as node_fetch from 'node-fetch'
const fetch = createFetch(node_fetch)

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type ApiResponse<T> = {
  meta: {
    status_code: number
    status_text: string
  }
  result: T
}

export async function request<ResponseObject>(
  method: Method,
  url: string,
  opts?: {
    body?: any
    query?: any
  }
): Promise<ApiResponse<ResponseObject>> {
  const requestURL = new URL(url, process.env.INPUT_INTEGRATIONS_API_BASE_URL)
  if (opts?.query) {
    // Sanitize the URL of any undefined values
    Object.keys(opts.query).forEach((key) => {
      if (opts.query[key] === undefined) {
        delete opts.query[key]
      }
    })
    requestURL.search = new URLSearchParams(opts.query).toString()
  }
  return await fetch(requestURL.toString(), {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.INPUT_INTEGRATIONS_API_ADMIN_TOKEN}`,
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  }).then((res) => res.json())
}
