import React, { Component } from 'react'
import Header from './Header'
import Bar from './BarChart'


class House extends Component {
  constructor(props) {
      super()

      this.state = {
        value: 510,
        unit: 'mA'
      }
  }
  
  returnCurrentView = () => {
    let window = this.props.window * -1

    switch (this.props.currentView) {
      case 0:
        return (
          <div className="panel">
            <Header
              title="House" 
              color={ this.props.color } 
              value={ this.state.value } 
              unit="mA" />
              
              <Bar 
                scores={ this.props.data.slice(window).map(elem => parseInt(elem.current).toFixed(0 )) } 
                timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                color={ this.props.color } 
                height='full' />
          </div>
        )
      
        case 1:
          return (
            <div className="panel">
              <Header
                title="House" 
                color={ this.props.color } 
                value={ this.state.value } 
                unit="V" 
                onClick={ this.props.onClick } />
                
                <Bar 
                  scores={ this.props.data.slice(window).map(elem => parseFloat(elem.voltage) * 10 ) }
                  timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) }
                  color={ this.props.color } 
                  height='full' />
            </div>
          )

        case 2:
          return (
            <div className="panel">
              <Header
                title="House" 
                color={ this.props.color } 
                value={ this.state.value } 
                unit="V" />

              <Bar 
                scores={ this.props.data.slice(window).map(elem => parseFloat(elem.current) ) } 
                timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                color={ this.props.color } 
                height='half'
                />

              <Bar 
                scores={ this.props.data.slice(window).map(elem => parseFloat(elem.voltage) * 10 ) } 
                timestamps={  this.props.data.slice(window).map(elem => parseInt(elem.timestamp) ) } 
                color={ this.props.color } 
                height='half'
                /> 
            </div>
          )
          
        case 3:
          return (
            <div className="panel">
              <Header
                title="House" 
                color={ this.props.color } 
                value=""
                unit="" />
            </div>
          )

        default:
          return (<div></div>)
    }
  }

  render () {
      let currentView = this.returnCurrentView()
    //  console.log( this.props.data )

      return (
        <div onClick={ this.props.onClick }>
          { currentView }
        </div>
      )
  }
}

export default House