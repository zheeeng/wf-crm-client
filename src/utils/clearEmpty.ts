export default function clearEmpty <O extends object, K extends keyof O>(obj: O) {
  return (Object.entries(obj) as Array<[K, O[K]]>).forEach(([k, v]) => {
    if (!v || (Array.isArray(v) && v.length === 0)) {
      delete obj[k]
    }
  })
}
