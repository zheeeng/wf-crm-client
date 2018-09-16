import * as React from 'react'

export default class AllLayout extends React.Component {
  handleClick = () => {
    console.log('.', (this.props as any).commands.list('.'))
    console.log('..', (this.props as any).commands.list('..'))
    console.log('/', (this.props as any).commands.list('/'))
    console.log('-', (this.props as any).commands.list('-'))
  }

  render () {
    return (
      <div onClick={this.handleClick}>
        AllLayout
        {this.props.children}
      </div>
    )
  }
}
