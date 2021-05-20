export default function shallowEqual<O extends Record<string, unknown>>(
  o1: O,
  o2: O,
) {
  return (Object.keys(o1) as (keyof O)[]).every((k) => o1[k] === o2[k])
}
