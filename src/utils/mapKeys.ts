export default function mapKeys<O, T = Record<string, unknown>>(
  mapper: (i: string) => string,
  obj: O,
): O | T {
  if (typeof obj !== 'object') return obj

  if (obj === undefined || obj === null) return obj

  return Object.entries(obj).reduce((acc, [k, v]) => {
    ;(acc as any)[mapper(k)] = v

    return acc
  }, {} as T)
}
