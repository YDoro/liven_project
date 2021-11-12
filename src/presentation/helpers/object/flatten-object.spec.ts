import { flattenObject } from './flatten-object'

describe('flattenObject', () => {
  test('should return flat object', () => {
    const result = flattenObject({ a: { b: { c: 'd' } }, b: { c: { d: 'e' } }, c: 'd' })
    expect(result).toEqual({ 'a.b.c': 'd', 'b.c.d': 'e', c: 'd' })
  })
  test('should return the same object', () => {
    const result = flattenObject({ a: 'd' })
    expect(result).toEqual({ a: 'd' })
  })
})
