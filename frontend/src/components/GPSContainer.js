import React, { Component } from 'react'
import GPS from './GPS'
import { connect } from 'react-redux'
import { addInitialData } from '../js/actions.js'
import store from '../js/store'
import axios from 'axios'

const mapStateToProps = state => {
  return { 
      data: state.gps,
      mostRecentData: state.gps[state.gps.length - 1]
  }
}

class ReduxGPSContainer extends Component {
  constructor(props) {
      super()

      this.state = {
          currentView: 0,
          color: 'cyan',
      }
  }

  componentWillMount() {
      axios.get(`/api/key/gps-set/`)
          .then(res => this.receivedInitialData(res.data))
  }

  receivedInitialData = (data) => {
      // console.log('gps data:', data)
      store.dispatch( addInitialData(data, 'gps') )
  }
  
  handleClick = () => {
    let view = this.state.currentView + 1

    this.setState({
      currentView: view < 2 ? view : 0
    })
  }

  render () {
    return ( 
      <GPS
        data={ this.props.data} 
        currentView={ this.state.currentView } 
        mostRecentData={ this.props.mostRecentData } 
        color={ this.state.color }
        onClick={ this.handleClick }
      />
    )
  }
}

const GPSContainer = connect(mapStateToProps)(ReduxGPSContainer)

export default GPSContainer