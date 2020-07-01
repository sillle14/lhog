import React from 'react'
import Map from './map'
import PowerPlant from './powerplant'
import './styles/board.css'

export class WattMatrixTable extends React.Component {

    render () {
        // TODO: Style the scrollbar so it always shows up against the white map bette
        return (
            <div id="board">
                <div id="main">
                    <div id="players">
                        <PowerPlant cost="3"></PowerPlant>
                    </div>
                    <Map cityStatus={this.props.G.cityStatus}></Map>
                </div>
                <div id="log"></div>
                <div id="action"></div>
            </div>
        )
    }
}