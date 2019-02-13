import React, { Component } from 'react'
import Header from './Header'
import moment from 'moment'

class System extends Component {
  constructor(props) {
      super()

      this.state = {
      }
  }
  
  returnSupervisorList = () => {
    if (this.props.supervisor.proceses) {
      let arr = JSON.parse(this.props.supervisor.proceses)
      console.log(arr)
      let list = arr.map(elem => {
        return (
          <div className="system-reporting-row">
            <p>{ elem.name }</p>
            <div>
              <p className="system-reporting-state" data-state={ elem.state }>
                { elem.statename.toLowerCase() }
              </p>
            </div>
          </div>
        )
      })

      return (
        <div>
          <h3>Supervisor</h3>
          { list }
        </div>
      )
    }
  }

  returnNetworkStatus = () => {
    if (this.props.network) { 

      return (
        <div>
          <h3>Network</h3>
          <div className="system-reporting-row">
            <p>Internet Accessable:</p>
            <p>{ this.props.network.connected }</p>
          </div>
          <div className="system-reporting-row">
            <p>Wan IP:</p>
            <p>{ this.props.network.wwanIp }</p>
          </div>
          <div className="system-reporting-row">
            <p>Last Update:</p>
            <p>{ moment(parseInt(this.props.network.timestamp) * 1000).fromNow() }</p>
          </div>
        </div>
      )
    }
  }

  returnCurrentView = () => {
    switch (this.props.currentView) {
      case 0:
        return (
          <div className="system-overview">
            { this.returnNetworkStatus() }
            { this.returnSupervisorList() }
          </div>
        )
      
        case 1:
          return (
            <div>                  
            </div>
          )

        case 2:
          return (
            <div>
            </div>
          )
          
        case 3:
          return (
            <div>
            </div>
          )

        default:
          return (<div></div>)
    }
  }

  render () {
    console.log( this.props )
      let currentView = this.returnCurrentView()

      return (
        <div className="system-container">
          <div className="panel">
            <Header
              title="System"
              onClick={ this.props.onClick }
              />
            { currentView }
          </div>
        </div>
      )
  }
}

export default System