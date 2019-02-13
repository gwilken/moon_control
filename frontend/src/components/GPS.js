import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature, Source } from "react-mapbox-gl";
import Header from './Header'

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZ3dpbGtlbiIsImEiOiJjanI1ajR6Z2QwMWk1NDRubXYyYmV6OHVkIn0.D68kEgoBzr8IZn8zz40MOQ"
});

class GPS extends Component {
  constructor(props) {
      super()

      this.state = {}
  }

  returnLastCooridates = () => {
    if (this.props.mostRecentData) {
      if (this.props.mostRecentData.lon !== 'n/a' && this.props.mostRecentData.lat !== 'n/a') {
        return [ parseFloat(this.props.mostRecentData.lon), parseFloat(this.props.mostRecentData.lat) ]
      }
    }
  }

  returnTrack = () => {
    return {
      "type": "geojson",
      "data": {
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": this.props.data.map(elem => {
                if (elem.lon !== 'n/a' && elem.lat !== 'n/a') {
                  return [parseFloat(elem.lon), parseFloat(elem.lat)]
                } else {
                  return
                }
              })
          },
          "properties": {
              "title": "Moontower Track"
          }
      }
    }
  }

  returnLastDataList = () => {
    let listArr = []

    for ( let [label, data] of Object.entries( this.props.data[this.props.data.length - 1]) ) {
      listArr.push(
        <div className="gps-info-row" label={ label } >
          <div className="gps-info-data">{ data }</div>
          <div className="gps-info-label">{ label }</div>
        </div>
      )
    }

    listArr.sort( (a,b) => {
      if(a.props.label < b.props.label) { return -1; }
      if(a.props.label > b.props.label) { return 1; }
      return 0;
    })

    return listArr
  }

  returnCurrentView = () => {
    switch (this.props.currentView) {
      //follow view
      case 0:
        return (
          <Map
            // eslint-disable-next-line 
            style="mapbox://styles/gwilken/cjr5ki34136js2rt88hwjq6km"
            // zoom={ [14] }
            center= { this.returnLastCooridates() }
            containerStyle={{
            height: "100%",
            width: "100%"
          }}>

          <Source
            id= "track"
            geoJsonSource={ this.returnTrack() } />

          <Layer 
            id="track-layer"
            type="line"
            sourceId="track"
            paint={{
              "line-color": "yellow",
              "line-opacity": 1,
              "line-width": 10
            }}/>

            <Layer
              id="marker"
              type="circle"
              paint={{
                "circle-radius": 5,
                "circle-stroke-width": 2,
                "circle-stroke-color": "yellow"
              }}>
            
              <Feature coordinates={ this.returnLastCooridates() } />
            </Layer>
          </Map>  
        )
    
      case 1:
        return ( 
          <div className="gps-info-container">
            { this.returnLastDataList() }
          </div>
         )

      default:
          break;
    }
  }

  render () {
    let currentView = this.returnCurrentView()

      return (
        <div className="gps-container" onClick={ this.props.onClick }>
           <div className="panel">
            <Header title="GPS" color="cyan" />
            { currentView }
          </div>
        </div>
      )
  }
}

export default GPS