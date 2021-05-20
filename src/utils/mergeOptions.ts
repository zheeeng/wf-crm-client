export default function mergeOptions<O extends any>(...options: O[]) {
  return options.reduce((merged, option) => {
    for (const key in option) {
      if (!Object.prototype.hasOwnProperty.call(option, key)) continue

      merged[key] =
        !merged[key] ||
        typeof merged[key] !== 'object' ||
        [merged[key], option[key]].some(Array.isArray)
          ? option[key]
          : mergeOptions(merged[key] as any, option[key])
    }

    return merged
  }, {} as O)
}
