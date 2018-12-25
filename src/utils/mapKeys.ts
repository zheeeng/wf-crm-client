export default function mapKeys <T> (mapper: (key: string) => string, obj: object) {
  const retObj = {}

  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      retObj[mapper(k)] = obj[k]
    }
  }

  return retObj as T
}
