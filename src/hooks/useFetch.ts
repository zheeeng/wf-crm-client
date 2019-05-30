import fetch from '~src/utils/fetchData'
import useSwitch from './useSwitch'

type DependencyList = ReadonlyArray<any>

const useFetch = (deps?: DependencyList) => useSwitch(fetch, deps)

export default useFetch
