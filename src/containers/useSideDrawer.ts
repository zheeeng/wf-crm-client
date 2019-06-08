import createUseContext from 'constate'
import { useBoolean } from 'react-hanger'

export default createUseContext(() => useBoolean(false))
