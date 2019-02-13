import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { mapRange } from '../js/helpers'

const mapStateToProps = state => {
  return {
    windowWidth: state.windowWidth,
    windowHeight: state.windowHeight
  }
}

class ReduxLineChart extends React.Component {
  constructor(props) {
    super()
 
    this.state = {
    }
  }

  svgPath = (points, command) => {
    const d = points.reduce((acc, point, i, a) => i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${command(point, i, a)}`
    , '')
    return d
  }

  line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]

    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }

  controlPoint = (current, previous, next, reverse) => {
    const p = previous || current
    const n = next || current
    const smoothing = 0.2
    const o = this.line(p, n)
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
  }

  bezierCommand = (point, i, a) => {
    const [cpsX, cpsY] = this.controlPoint(a[i - 1], a[i - 2], point)
    const [cpeX, cpeY] = this.controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
  }

  chart = (scoresArr, timestamps) => {
    let screenWidth = typeof this.props.windowWidth != 'undefined' ? this.props.windowWidth : window.innerWidth
    let screenHeight = typeof this.props.windowHeight != 'undefined' ? this.props.windowHeight : window.innerHeight
    let width = screenWidth
    let height
    
    if (this.props.height === 'full') {
      height = (screenHeight / 2) - 77
    }
        
    if (this.props.height === 'half') {
      height = ((screenHeight / 2) - 77) / 2
    }

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

    let lineContainer = {
      x: 0,
      y: 0,
      width: chartContainer.width,
      height: chartContainer.height - titleContainer.height
    }

    let minScore = Math.min(...scoresArr[0].concat(scoresArr[1]))
    let maxScore = Math.max(...scoresArr[0].concat(scoresArr[1]))
  
    let paths = scoresArr.map((scores, index) => {
      let points = scores.map((score, index) => {
        let y = lineContainer.height - mapRange(score, minScore - 10, maxScore + 10, 0, lineContainer.height)
        let x = ((lineContainer.width / scores.length) * index) + ((lineContainer.width / scores.length) / 2)
        return ([x, y])
      })
  
      let path = this.svgPath(points, this.bezierCommand)
     // path += `V ${lineContainer.height} H ${lineContainer.x} V ${points[0][1]} Z` 

      return (
        <path
          d={ path }
          className="comp-path"
          stroke={ this.props.color[index] }
          strokeWidth="2"
          //fill={ this.props.color[index] }
           />
      )
    })

    let displayTime = moment(timestamps[0] * 1000).fromNow(true)

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
        <div className="chart-container">
          <svg height={ height } width="100%" className="chart-svg" viewBox={"0 0 " + width + " " + height} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            { paths }
            { title }
          </svg>
        </div>
      )
    }
  

  render () {
    let chart = this.chart(this.props.scores, this.props.timestamps)
    
    return (
      <div className="line-chart">
        { chart }
      </div>
    )
  }

}

const LineChart = connect(mapStateToProps)(ReduxLineChart)

export default LineChart
