import * as React from 'react'

export default class StarredLayout extends React.Component {
  render () {
    return (
      <div>
        StarredLayout
        {this.props.children}
      </div>
    )
  }
}
