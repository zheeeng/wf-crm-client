import fetchData from '~src/utils/fetchData'
import useSwitch from './useSwitch'

type DependencyList = ReadonlyArray<any>

const useFetch = (deps?: DependencyList) => useSwitch(fetchData, deps)

export default useFetch
