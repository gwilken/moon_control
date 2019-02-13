import React from 'react'
import Bar from './BarChart'
import Line from './LineChart'
import Header from './Header'

const Panel = (props) => {
  return (
    <div className="panel">
      <Header title={ props.title } color={ props.color } value={ props.value } unit={ props.unit } />
      { props.chartType === 'line'
        ? <Line 
            scores={ props.scores } 
            timestamps={ props.timestamps } 
            color={ props.color } />
      
        : <Bar 
            scores={ props.scores } 
            timestamps={ props.timestamps } 
            color={ props.color } />
      }
    </div>
  )
}
    
export default Panel