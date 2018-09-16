import * as React from 'react'

export default class MyCustomersLayout extends React.Component {

  render () {
    return (
      <div>
        MyCustomersLayout
        {this.props.children}
      </div>
    )
  }
}
