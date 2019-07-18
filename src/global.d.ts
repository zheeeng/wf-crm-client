type May<T> = T | undefined
type Ga = May<(c: 'set', t: 'page', page: string) => void> & May<(c: 'send', t: 'pageview') => void>
declare let ga: Ga
