import React, { Component } from 'react'
import House from './House'
import { connect } from 'react-redux'
import { addInitialData } from '../js/actions.js'
import store from '../js/store'
import axios from 'axios'


const mapStateToProps = state => {
  return { data: state.house }
}


class ReduxHouseContainer extends Component {
constructor(props) {
    super()

    this.state = {
        currentView: 0,
        window: 30,
        color: 'cyan',
        mostRecentData: null
    }
}

componentWillMount() {
    axios.get(`/api/window/house-set/${this.state.window}`)
        .then(res => this.receivedInitialData(res.data))
}

receivedInitialData = (data) => {
    store.dispatch( addInitialData(data, 'house') )
}

handleClick = () => {
  let view = this.state.currentView + 1

  this.setState({
    currentView: view < 4 ? view : 0
  })
}

handleChangeWindow = (val) => {
  this.setState({
    window: val
  })
}

render () {
    return ( 
      <House
        data={ this.props.data} 
        currentView={ this.state.currentView } 
        mostRecentData={ this.state.mostRecentData } 
        color={ this.state.color }
        window={ this.state.window }
        onClick={ this.handleClick }
      />
    )
  }
}

const HouseContainer = connect(mapStateToProps)(ReduxHouseContainer)

export default HouseContainer