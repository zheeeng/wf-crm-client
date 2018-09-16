import * as React from 'react'

export default class DashboardLayout extends React.Component {
  render () {
    return (
      <div>
        DashboardLayout
        {this.props.children}
      </div>
    )
  }
}
