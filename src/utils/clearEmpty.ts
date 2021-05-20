export default function clearEmpty<
  O extends Record<string, unknown>,
  K extends keyof O,
>(obj: O) {
  return (Object.entries(obj) as [K, O[K]][]).forEach(([k, v]) => {
    if (!v || (Array.isArray(v) && v.length === 0)) {
      delete obj[k]
    }
  })
}
