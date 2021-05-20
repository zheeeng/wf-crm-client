export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Arrify<T> = {
  [P in keyof T]: T[P][]
}
