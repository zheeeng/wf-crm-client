export default function mapKeys <T>(mapper: (i : string) => string, obj: object) {
  if (obj === undefined || obj === null) return obj

  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      (acc as any)[mapper(k)] = v

      return acc
    },
    {} as T,
  )
}
