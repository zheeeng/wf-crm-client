import * as React from 'react'

export default class WaiverLayout extends React.Component {
  render () {
    return (
      <div>
        Waiver Layout
        {this.props.children}
      </div>
    )
  }
}
