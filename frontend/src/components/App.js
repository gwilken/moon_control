import React from 'react'
import Dashboard from './Dashboard'
import SolarContainer from './SolarContainer'
import HouseContainer from './HouseContainer'
import GPSContainer from './GPSContainer'
import SystemContainer from './SystemContainer'
// import Fridge from './Fridge'

require('../js/ui/resizeListener')
require('./Websocket')

const App = () => {
  return (
    <div>
      <Dashboard>
        {/* <SolarContainer />
        <HouseContainer /> */}
        <GPSContainer />
        <SystemContainer />
      </Dashboard>
    </div>
  );
}

export default App