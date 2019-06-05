import fetchData from '~src/utils/fetchData'
import useSwitch from './useSwitch'

type DependencyList = any[]

const useFetch = (deps?: DependencyList) => useSwitch(fetchData, deps)

export default useFetch
