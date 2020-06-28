import React from 'react'
import Map from './map'

export class WattMatrixTable extends React.Component {

    render () {
        return <Map cityStatus={this.props.G.cityStatus}></Map>
    }
}