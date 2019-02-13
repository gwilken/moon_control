import React from 'react'

const style = {
  display: 'grid',
  gridTemplateRows: '[row-1] 95% [row-2] 5%' ,
  gridTemplateColumns: '[col-1] 75% [col-2] 25%',
  //gridTemplateColumns: '[col-1] 100%',
  height: '100vh'
}

const Dashboard = (props) => {
  return (
    <div style={ style }>
      { props.children }
    </div>
  )
}

export default Dashboard