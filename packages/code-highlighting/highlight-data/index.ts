import * as traverse from './traverse'
import highlightString from '../highlight-string'

type DataNode = {
  code: string
  language: string | { slug: string; name: string }
}

/**
 * Given a data object,
 * find all nodes that are themselves objects
 * and have { code, language } properties,
 *
 * where `code` is a plain string of code, and
 * where `language` is either a string or an
 * object with a `slug` property which is a string.
 *
 * Modify these objects such that the `code`
 * property is transformed into a highlighted
 * string of HTML, using the detected `language`,
 * and then return the original object with
 * these modifications.
 * @param data
 */
export default async function highlightData(
  data: Record<string, DataNode | unknown>
): Promise<Record<string, DataNode | unknown>> {
  return await traverse.traverse(data, async (_key, value) => {
    //  We're looking for objects
    if (!traverse.isObject(value)) return value
    const { code, language } = value as DataNode
    //  That have both { code, language }
    if (!code || !language) return value
    const languageSlug = typeof language === 'string' ? language : language.slug
    //  And that have a language slug we can use
    if (!languageSlug) return value
    //  If our object has all these things, we modify the
    //  code property to transform it from an un-highlighted string
    //  to a highlighted HTML string
    value.code = await highlightString(code, languageSlug)
    return value
  })
}
