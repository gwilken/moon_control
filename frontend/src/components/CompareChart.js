import React, { Component } from 'react'
import Header from './Header'
import Line from './LineChart'
import axios from 'axios'
import moment from 'moment'

class CompareChart extends Component {
  constructor(props) {
      super()

      this.state = {
        window: 120
      }
  }

  componentWillMount() {
    axios.get(`/api/window/solar-set/${this.state.window}`)
      .then(res => this.receivedSolarData(res.data))

    axios.get(`/api/window/house-set/${this.state.window}`)
      .then(res => this.receivedHouseData(res.data))    
  }

  receivedSolarData = (data) => {
    this.setState({
      solar: data 
    })
  }
  
  receivedHouseData = (data) => {
    this.setState({
      house: data 
    })
  }

  render () {
    return (
      <div className="panel">
      <Header
        title= "Solar" 
        color= { this.props.color } 
        value= "Compare"
      />

      { this.state.solar && this.state.house && 
        <Line 
          scores={[
            this.state.solar.map(elem => parseInt(elem.current).toFixed(0 )), 
            this.state.house.map(elem => parseInt(elem.current).toFixed(0 )) 
          ]} 
          timestamps={  this.state.house.map(elem => parseInt(elem.timestamp) ) }
          color={[
            "rgba(255, 255, 0, .9)",
            "cyan"
          ]}
          height="full" />
      }

      </div>
    )
  }
}

export default CompareChart