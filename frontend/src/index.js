import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './js/store'
import App from './components/App'

import './css/index.scss'

ReactDOM.render (
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById('root')
)

console.log(`
888b     d888  .d88888b.   .d88888b.  888b    888                              
8888b   d8888 d88P" "Y88b d88P" "Y88b 8888b   888                              
88888b.d88888 888     888 888     888 88888b  888                              
888Y88888P888 888     888 888     888 888Y88b 888                              
888 Y888P 888 888     888 888     888 888 Y88b888                              
888  Y8P  888 888     888 888     888 888  Y88888                              
888   "   888 Y88b. .d88P Y88b. .d88P 888   Y8888                              
888       888  "Y88888P"   "Y88888P"  888    Y888                              
 .d8888b.   .d88888b.  888b    888 88888888888 8888888b.   .d88888b.  888      
d88P  Y88b d88P" "Y88b 8888b   888     888     888   Y88b d88P" "Y88b 888      
888    888 888     888 88888b  888     888     888    888 888     888 888      
888        888     888 888Y88b 888     888     888   d88P 888     888 888      
888        888     888 888 Y88b888     888     8888888P"  888     888 888      
888    888 888     888 888  Y88888     888     888 T88b   888     888 888      
Y88b  d88P Y88b. .d88P 888   Y8888     888     888  T88b  Y88b. .d88P 888      
 "Y8888P"   "Y88888P"  888    Y888     888     888   T88b  "Y88888P"  88888888 
`)