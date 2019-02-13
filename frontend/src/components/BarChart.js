import React, { Component } from 'react'
import moment from 'moment';
import { connect } from 'react-redux'
import { mapRange } from "../js/helpers.js"

const mapStateToProps = state => {
  return { 
    windowWidth: state.windowWidth,
    windowHeight: state.windowHeight
  }
}

class ReduxBarChart extends Component {
  constructor(props) {
    super()

    this.state = {
      tooltip: null,
      tooltipRect: null
    }
  }

  tooltipRef = (element) => {
    if (element) {
      this.setState({
        tooltipRect: element.getBBox()
      })
    }
  }

  handleHover = (point) => (e) => {
    if(point) {
      this.setState({
        tooltip: point
      })
    } 

    else {
     this.setState({
        tooltip: null
      })
    }
  }
 
  buildChart = (scores, timestamps) => {
    // let ratio = .75
    let screenWidth = typeof this.state.windowWidth != 'undefined' ? this.state.windowWidth : window.innerWidth
    let screenHeight = typeof this.state.windowHeight != 'undefined' ? this.state.windowHeight : window.innerHeight
    let width = screenWidth
    let height
    
    if (this.props.height === 'full') {
      height = (screenHeight / 2) - 77
    }
        
    if (this.props.height === 'half') {
      height = ((screenHeight / 2) - 77) / 2
    }

    let maxValue = Math.max(...scores)
    let minValue = Math.min(...scores)

    let chartContainer = {
      x: 0,
      y: 0,
      width: width,
      height: height
    }

    let titleContainer = {
      x: 0,
      y: chartContainer.height,
      width: width,
      height: 10
    }

    let barsContainer = {
      x: 0,
      y: 0,
      width: chartContainer.width,
      height: chartContainer.height - titleContainer.height
    }

    let bars = scores.map( (score, index) => {
      let padding = (barsContainer.width / scores.length) * .35
      let barWidth = (barsContainer.width / scores.length)
      let barHeight = mapRange(score, minValue, maxValue, 0, barsContainer.height);

      let y = barsContainer.height - barHeight
      let x = index * barWidth
      let displayLabel = moment(timestamps[index] * 1000).fromNow()

      let point = { x: x + (barWidth / 2), y, displayLabel, score }

      return (  
        <g 
          onMouseOver={ this.handleHover(point) }
          onMouseOut={ this.handleHover(null) }
          key={'bar-' + index} >
          
          <rect
            x={ x + (padding / 4) }
            y={ y }
            width={ (barWidth - (padding / 2)) }
            height={ barHeight  }
            fill={ this.props.color }
            strokeWidth={ timestamps.length > 30 ? 0 : 1 }
            stroke={ this.props.color } />
         </g>
        )}
    )

    let displayTime = moment.duration( (timestamps[timestamps.length - 1] * 1000) - (timestamps[0] * 1000)).humanize()

    let title = 
    ( <g>
        <text 
          x={ titleContainer.width / 2 } 
          y={ titleContainer.y + 1 } 
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="silver" 
          fontSize="12">
          { displayTime }
        </text>
      </g> )

     return (
        <svg height={ height } width="100%" className="chart-svg" viewBox={"0 0 " + width + " " + height} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          { bars }
          { title }

          { this.state.tooltip &&
              <g>
                { this.state.tooltipRect && 
                  <rect
                    x={ this.state.tooltipRect.x - 10 }
                    y={ this.state.tooltipRect.y - 8 }
                    rx="5"
                    ry="5"
                    width={ this.state.tooltipRect.width + 20 }
                    height={ this.state.tooltipRect.height + 16 }
                    fill="black"
                    stroke="white"
                    strokeWidth="2"
                  />
                }

                <text
                  ref={ this.tooltipRef }
                  x={ this.state.tooltip.x + 50 > width ? width - 50 : (this.state.tooltip.x - 50 < 0 ? 50 : this.state.tooltip.x) }
                  y={ this.state.tooltip.y - 25 <= 0 ? 25 : this.state.tooltip.y - 25 }
                  textAnchor="middle"
                  fill="white" >
                    { this.state.tooltip.displayLabel }: { this.state.tooltip.score } 
                </text>
              </g>
            }
        </svg>
    )
  }
 
  render () {
    let chart = this.buildChart(this.props.scores, this.props.timestamps) 

    return (
      <div className="bar-chart">
        { chart }
      </div>
    )
  }
}

const BarChart = connect(mapStateToProps)(ReduxBarChart)

export default BarChart
