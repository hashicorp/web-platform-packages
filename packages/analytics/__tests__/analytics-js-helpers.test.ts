/** @jest-environment jsdom */
import { jest } from '@jest/globals'
import {
  getSegmentId,
  isAnalyticsMethodAvailable,
  track,
} from '../analytics-js-helpers'

describe('isAnalyticsMethodAvailable', () => {
  test('returns false if method is undefined', () => {
    expect(isAnalyticsMethodAvailable('track')).toBeFalsy()
  })

  test('returns true if method is defined', () => {
    const originalValue = window.analytics
    // @ts-expect-error -- this does not satisfy the actual type, but is appropriate for the test case
    window.analytics = {
      track: jest.fn(),
    }

    expect(isAnalyticsMethodAvailable('track')).toBeTruthy()

    window.analytics = originalValue
  })
})

describe('track', () => {
  let originalValue: any

  beforeAll(() => {
    originalValue = window.analytics
    // @ts-expect-error -- this does not satisfy the actual type, but is appropriate for the test case
    window.analytics = {
      track: jest.fn(),
    }
  })

  afterAll(() => {
    window.analytics = originalValue
  })

  test('calls window.analytics.track() with the provided eventName', () => {
    track('my event')

    expect(window.analytics.track).toHaveBeenCalledWith('my event', undefined)
  })

  test('calls window.analytics.track() with the provided properties', () => {
    const properties = { some: 'other', properties: 1 }
    track('my event', properties)

    expect(window.analytics.track).toHaveBeenCalledWith('my event', properties)
  })
})

describe('getSegmentId', () => {
  let originalValue: any

  beforeAll(() => {
    originalValue = window.analytics
    window.analytics = {
      // @ts-expect-error -- this does not satisfy the actual type, but is appropriate for the test case
      user: jest.fn(() => ({
        anonymousId: jest.fn(() => '123abc'),
      })),
    }
  })

  afterAll(() => {
    window.analytics = originalValue
  })

  test('calls window.analytics.track() with the provided eventName', () => {
    expect(getSegmentId()).toEqual('123abc')
  })
})
