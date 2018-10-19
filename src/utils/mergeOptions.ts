export default function mergeOptions<O> (...options: O[]) {

  return options.reduce(
    (merged, option) => {
      for (const key in option) {
        if (!option.hasOwnProperty(key)) continue

        merged[key] = (
          // tslint:disable-next-line:strict-type-predicates
          !merged[key] || typeof merged[key] !== 'object' || [merged[key], option[key]].some(Array.isArray)
        )
          ? option[key]
          : mergeOptions(merged[key] as any, option[key] as any)
      }

      return merged
    },
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as O,
  )
}
