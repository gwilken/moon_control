import React, { Component } from 'react'
import System from './System'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return { 
    supervisor: state.supervisor,
    network: state.network
  }
}


class ReduxSystemContainer extends Component {
  constructor(props) {
    super()

    this.state = {
        currentView: 0
    }
}

handleChangeWindow = (val) => {
  this.setState({
    window: val
  })
}

handleClick = () => {
  let view = this.state.currentView + 1

  this.setState({
    currentView: view < 4 ? view : 0
  })
}

render () {
    return ( 
      <System
        { ...this.props }
        currentView={ this.state.currentView } 
        onClick={ this.handleClick } />
    )
  }
}

const SystemContainer = connect(mapStateToProps)(ReduxSystemContainer)

export default SystemContainer