import { pushData, updateKey } from '../js/actions.js'
import store from '../js/store'

const createWebSocket = () => {
    let ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data)
    
            console.log(data)

            if (data.parent) {
                if(data.parent === 'system') {
                    //console.log(data)

                    store.dispatch (updateKey(data, data.type) )
                } else {
                    store.dispatch( pushData(data, data.parent) )
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    ws.onerror = (err) => {
        var readyState = ws.readyState;
        console.log('Error at websocket', err)

        // if (readyState !== 1) {
        //     console.log('Websocket closed. Attempt reconnect in 1 second...')
        //     setTimeout(() => createWebSocket(), 1000)
        // }
    }
    
    ws.onclose = () => {
        console.log('Websocket closed. Attempt reconnect in 1 second...')
        setTimeout(() => createWebSocket(), 1000)
    }

}


createWebSocket()

//raspi pi ip

//const ws = new WebSocket('ws://localhost:8080')




