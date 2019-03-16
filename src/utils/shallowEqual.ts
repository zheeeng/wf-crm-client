export default function shallowEqual<O extends object>(o1: O, o2: O) {
  return (Object.keys(o1) as Array<keyof O>).every(k => o1[k] === o2[k])
}
