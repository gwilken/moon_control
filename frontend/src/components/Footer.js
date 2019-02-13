import React from 'react'

const style = {
    gridRow: 'footer',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white'
}

const Footer = ({title, version}) => {
    return(
        <div style={ style }>
            <div>{ title }</div>
            <div>{ version }</div>
        </div>
    )
}

export default Footer