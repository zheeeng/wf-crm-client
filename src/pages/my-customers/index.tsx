import * as React from 'react'

export default class MyCustomersIndex extends React.Component {
  handleClick = () => {
    console.log('.', (this.props as any).commands.list('.'))
    console.log('..', (this.props as any).commands.list('..'))
    console.log('/', (this.props as any).commands.list('/'))
    console.log('-', (this.props as any).commands.list('-'))
  }

  render () {
    return (
      <div onClick={this.handleClick}>
        My Customers Index
      </div>
    )
  }
}
