export default function mergeOptions<O extends object> (...options: O[]) {

  return options.reduce(
    (merged, option) => {
      for (const key in option) {
        if (!option.hasOwnProperty(key)) continue

        merged[key] = (
          !merged[key]
          || typeof merged[key] !== 'object'
          || [merged[key], option[key]].some(Array.isArray)
        )
          ? option[key]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          : mergeOptions(merged[key] as any, option[key])
      }

      return merged
    },
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    {} as O,
  )
}
