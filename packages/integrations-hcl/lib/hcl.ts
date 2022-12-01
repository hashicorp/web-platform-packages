import hcl from 'hcl2-parser'
import { z } from 'zod'

type Result<S = any> =
  | {
      data: S
      error: null
    }
  | {
      data: null
      error: Error
    }

/**
 * A generic wrapper for our HCL models. Pass an HCL string
 * and a Zod schema and receive an instance with a strongly
 * typed `data` property.
 */
export default class HCL<S = any> {
  result: Result<S>

  constructor(hclString: string, schema: z.Schema<S>) {
    this.result = this.validateHCL(hclString, schema)
  }

  validateHCL<T>(hclString: string, schema: z.Schema<T>): Result<T> {
    // parse HCL string contents to an object
    const [res, err] = hcl.parseToObject(hclString)
    if (err !== null) {
      return {
        data: null,
        error: new Error(`Failed to parse HCL: ${err}`),
      }
    }

    // validate object against provided schema
    const parseResult = schema.safeParse(res)
    if (parseResult.success === false) {
      const msg = parseResult.error.errors.map(
        (e) => `\n ${e.message} @ ${e.path.join('.')}`
      )
      return {
        data: null,
        error: new Error(`HCL doesn't match provided schema: ${msg}`),
      }
    }

    // return the typed object
    return {
      data: parseResult.data,
      error: null,
    }
  }
}
