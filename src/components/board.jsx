import React from 'react'
import Map from './map'
import './styles/board.css'

export class WattMatrixTable extends React.Component {

    render () {
        // TODO: Style the scrollbar so it always shows up against the white map bette
        return (
            // <div id="board">
            //     <div id="main">
            //         <div id="players"></div>
            //         <Map cityStatus={this.props.G.cityStatus}></Map>
            //     </div>
            //     <div id="log"></div>
            //     <div id="action"></div>
            // </div>
            <Map cityStatus={this.props.G.cityStatus}></Map>
        )
    }
}