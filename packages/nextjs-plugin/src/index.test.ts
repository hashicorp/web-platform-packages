import withHashicorp from './index'
import nextOptimizedImages from '@hashicorp/next-optimized-images'

jest.mock('@hashicorp/next-optimized-images', () =>
  jest.fn().mockImplementation((x) => x)
)

beforeEach(() => {
  jest.clearAllMocks()
})

test('dato token default', () => {
  console.log(withHashicorp({ dato: { token: 'foo' } })())
  expect(withHashicorp({ dato: { token: 'foo' } })().env.HASHI_DATO_TOKEN).toBe(
    'foo'
  )
})

test('dato environment default', () => {
  expect(
    withHashicorp({ dato: { environment: 'test' } })().env
      .HASHI_DATO_ENVIRONMENT
  ).toBe('test')
})

test("dato token doesn't clobber environment variables", () => {
  const config = withHashicorp({ dato: { token: 'foo' } })({
    env: { foo: 'bar' },
  })
  expect(config.env.HASHI_DATO_TOKEN).toBe('foo')
  expect(config.env.foo).toBe('bar')
})

test('default headers are default', () => {
  const config = withHashicorp()({})
  return config.headers?.().then((result) => {
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    })
  })
})

test('default headers integrate with user land headers', () => {
  const userLandHeader = [
    {
      source: '/foo',
      headers: [
        {
          key: 'test',
          value: 'true',
        },
      ],
    },
  ]
  const config = withHashicorp()({
    async headers() {
      return userLandHeader
    },
  })
  return config.headers?.().then((result) => {
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(userLandHeader[0])
    // ensure the last header is SAMEORIGIN, so it can't be overidden
    const last = result.length - 1
    expect(result[last].headers).toHaveLength(1)
    expect(result[last]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    })
  })
})

test('default headers plus tipBranch is set', () => {
  const userLandHeader = [
    {
      source: '/foo',
      headers: [
        {
          key: 'test',
          value: 'true',
        },
      ],
    },
  ]
  // override ENV variable to simulate build environment
  process.env.VERCEL_GIT_COMMIT_REF = 'tippy'
  const config = withHashicorp()({
    tipBranch: 'tippy',
    async headers() {
      return userLandHeader
    },
  })
  return config.headers?.().then((result) => {
    expect(result).toHaveLength(3)
    // ensure noindex is set for all paths
    expect(result[0]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    })
    // ensure we still respect user land headers
    expect(result[1]).toEqual(userLandHeader[0])
    // ensure the last header is SAMEORIGIN, as it can't be overidden
    const last = result.length - 1
    expect(result[last].headers).toHaveLength(1)
    expect(result[last]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    })
  })
})

test('tipBranch headers come when no user land headers are set', () => {
  // override ENV variable to simulate build environment
  process.env.VERCEL_GIT_COMMIT_REF = 'tippy'
  const config = withHashicorp()({
    tipBranch: 'tippy',
  })
  return config.headers?.().then((result) => {
    expect(result).toHaveLength(2)
    // ensure noindex is set for all paths
    expect(result[0]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    })
    // ensure the last header is SAMEORIGIN, as it can't be overidden
    const last = result.length - 1
    expect(result[last].headers).toHaveLength(1)
    expect(result[last]).toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    })
  })
})

test('ensure x-robot-tag header not set when not on tipBranch', () => {
  // override ENV variable to simulate build environment
  process.env.VERCEL_GIT_COMMIT_REF = 'not-tippy'
  const config = withHashicorp()({
    tipBranch: 'tippy',
  })
  return config.headers?.().then((result) => {
    expect(result).toHaveLength(1)
    // ensure X-Robots-Tag is not present
    expect(result[0].source).toBe('/:path*{/}?')
    expect(result[0].headers).toHaveLength(1)
    expect(result[0]).not.toEqual({
      source: '/:path*{/}?',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    })
  })
})

test('nextOptimizedImages true - integrates next-optimized-images plugin', () => {
  const config = withHashicorp({ nextOptimizedImages: true })()

  expect(config.images.disableStaticImages).toEqual(true)
  expect(nextOptimizedImages).toHaveBeenCalled()
})

test('nextOptimizedImages false - does not integrate next-optimized-images plugin', () => {
  const config = withHashicorp({ nextOptimizedImages: false })()

  expect(config?.images?.disableStaticImages).toBeUndefined()
  expect(nextOptimizedImages).not.toHaveBeenCalled()
})
