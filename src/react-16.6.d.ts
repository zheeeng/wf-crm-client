import * as React from 'react'

declare module 'react' {
  function memo<P> (
    Component:React.SFC<P>,
    propsAreEqual?:((
        prevProps: Readonly<P & { children?: ReactNode }>,
        nextProps: Readonly<P & { children?: ReactNode }>
      )=>boolean
    )):React.SFC<P>

  function lazy<T extends () => Promise<{ default: React.ComponentType<any> }>> (
    importFunction: T,
  ): T extends () => Promise<{ default: React.ComponentType<infer P> }>
    ? React.ComponentType<P>
    : React.ComponentType
}
