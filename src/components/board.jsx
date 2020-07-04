import React from 'react'
import Map from './map'
import Market from './market'
import ResourceMarket from './resourceMarket'
import Reference from './reference'
import { Players, Player}  from './players'
import './styles/board.css'

export class WattMatrixTable extends React.Component {

    render () {
        // TODO: Style the scrollbar so it always shows up against the white map bette
        return (
            <div id="board">
                <div id="main">
                    <Market powerplants={this.props.G.powerplants}/><hr/>
                    <Players players={this.props.G.players}/><hr/>
                    <Map cityStatus={this.props.G.cityStatus}/><hr/>
                    <ResourceMarket
                        coalMarket={this.props.G.coalMarket}
                        oilMarket={this.props.G.oilMarket}
                        trashMarket={this.props.G.trashMarket}
                        uraniumMarket={this.props.G.uraniumMarket}
                    /><hr/>
                    <Reference numPlayers={this.props.ctx.numPlayers} step={this.props.G.step}/>
                </div>
                <div id="sidebar"><Player player={this.props.G.players[2]} playerID={2}/></div>
                <div id="action"></div>
            </div>
        )
    }
}