import React from 'react'
import Map from './map'
import Market from './market'
import Players from './players'
import './styles/board.css'

export class WattMatrixTable extends React.Component {

    render () {
        // TODO: Style the scrollbar so it always shows up against the white map bette
        return (
            <div id="board">
                <div id="main">
                    <Market powerplants={this.props.G.powerplants}/>
                    <Players players={this.props.G.players}/>
                    <Map cityStatus={this.props.G.cityStatus}/>
                </div>
                <div id="log"></div>
                <div id="action"></div>
            </div>
        )
    }
}