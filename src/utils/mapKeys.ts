export default function mapKeys <T>(mapper: (i : string) => string, obj: object) {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      (acc as any)[mapper(k)] = v

      return acc
    },
    {} as T,
  )
}
