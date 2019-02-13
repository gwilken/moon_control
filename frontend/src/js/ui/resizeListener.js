import store from '../store'
import { windowResize } from '../actions.js'

const handleResize = () => {
    let size = {
        width: window.innerWidth,
        height: window.innerHeight
    }
      
    store.dispatch(windowResize(size))
}
  
window.addEventListener('resize', handleResize)