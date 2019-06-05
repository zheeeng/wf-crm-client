export default function mapKeys <T>(mapper: (i: string) => string, obj: object) {
  if (obj === undefined || obj === null) return obj

  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc as any)[mapper(k)] = v

      return acc
    },
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    {} as T,
  )
}
