import yaml from 'yaml'
import { VFile } from 'vfile'
import type { Compatible } from 'vfile'

/**
 * Use a proxy to make an object immutable. Defines an object setter that immediately throws.
 */
function immutable<T extends Record<string | symbol, any>>(
  obj: T
): Readonly<T> {
  return new Proxy(obj, {
    get(target, property) {
      return typeof target[property] === 'object'
        ? immutable(target[property])
        : target[property]
    },
    set() {
      throw new Error('Unable to modify object')
    },
  })
}

/**
 * Represents a file with some sort of content-adjacent data, such as JSON files with nav data or YAML tutorial pages files.
 */
export class DataFile extends VFile {
  __type = 'data' as const

  declare result: any

  constructor(value?: Compatible) {
    super(value)
  }

  /**
   * Get the contents of the file as a JavaScript object for checking. Parses the file from its raw format if not done so already.
   */
  contents() {
    if (!this.result) {
      this.parse()
    }

    return this.result
  }

  /**
   * Parse data file into a JavaScript object so that it can be checked.
   */
  private parse() {
    switch (this.extname) {
      case '.json': {
        this.result = immutable(JSON.parse(String(this.value)))
        break
      }
      case '.yml':
      case '.yaml': {
        this.result = immutable(yaml.parse(String(this.value)))
        break
      }
      default: {
        console.warn(
          `[content-conformance] unable to parse data file with extension: ${this.extname}`
        )
      }
    }
  }
}

export function isContentFile(file: unknown): file is DataFile {
  return (file as DataFile).__type === 'data'
}
