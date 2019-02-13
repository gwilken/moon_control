import React, { Component } from 'react'
import Header from './Header'
import Bar from './BarChart'
import CompareChart from './CompareChart'

class Solar extends Component {
  constructor(props) {
      super()

      this.state = {
      }
  }
  
  returnCurrentView = () => {
    let window = this.props.window * -1

    switch (this.props.currentView) {
      //current view
      case 0:
        return (
          <div className="panel">
              <Header
                title="Solar" 
                color={ this.props.color } 
                value={ this.props.data.length > 1 ? parseFloat(this.props.data[this.props.data.length - 1].current).toFixed(0) : null } 
                unit="mA" />
                
                <Bar 
                  scores={ this.props.data.slice(window).map(elem => parseInt(elem.current).toFixed(0 )) } 
                  timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                  color={ this.props.color }
                  height='full' />
          </div>
        )
      
        case 1:
        //voltage view
          return (
            <div className="panel">
                <Header
                  title="Solar" 
                  color={ this.props.color } 
                  value={ this.props.data.length > 1 ? parseFloat(this.props.data[this.props.data.length - 1].voltage).toFixed(2) : null } 
                  unit="V" />
                  
                  <Bar 
                    scores={ this.props.data.slice(window).map(elem => parseInt(elem.voltage * 100).toFixed(0 )) } 
                    timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                    color={ this.props.color } 
                    height='full'/>
            </div>
          )

        case 2:
        //current & voltage view
          return (
            <div className="panel">
              <Header
                title="Solar" 
                color={ this.props.color } 
                value={ this.props.data.length > 1 
                  ? `${parseFloat(this.props.data[this.props.data.length - 1].current).toFixed(0)}mA ${parseFloat(this.props.data[this.props.data.length - 1].voltage).toFixed(0)}V`
                  : null } />
                
                <Bar 
                  scores={ this.props.data.slice(window).map(elem => parseInt(elem.current).toFixed(0 )) } 
                  timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                  color={ this.props.color } 
                  height='half'/>

                <Bar 
                  scores={ this.props.data.slice(window).map(elem => parseInt(elem.voltage * 100).toFixed(0 )) } 
                  timestamps={  this.props.data.map(elem => parseInt(elem.timestamp) ) } 
                  color={ this.props.color } 
                  height='half'/>
            </div>
          )
          
        case 3:
        //compare view
          return (
            <CompareChart />
          )

        default:
          return (<div></div>)
    }
  }

  render () {
      let currentView = this.returnCurrentView()

      return (
        <div onClick={ this.props.onClick }>
          { currentView }
        </div>
      )
  }
}

export default Solar