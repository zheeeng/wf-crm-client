import * as React from 'react'

export default class GroupsContactLayout extends React.Component {
  render () {
    (window as any).lc = (this.props as any).commands.list

    return (
      <div>
        GroupsContactLayout
        {this.props.children}
      </div>
    )
  }
}
