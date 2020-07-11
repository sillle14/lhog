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
            <div className="board">
                <div className="main">
                    <Market 
                        powerplantMarket={this.props.G.powerplantMarket} 
                        selected={this.props.G.auction.upForAuction}
                        selectPowerplant={this.props.moves.selectPowerplant}
                    /><hr/>
                    <Players players={this.props.G.players}/><hr/>
                    <Map 
                        cityStatus={this.props.G.cityStatus}
                        playerID={this.props.playerID}
                    /><hr/>
                    <ResourceMarket
                        coalMarket={this.props.G.coalMarket}
                        oilMarket={this.props.G.oilMarket}
                        trashMarket={this.props.G.trashMarket}
                        uraniumMarket={this.props.G.uraniumMarket}
                    /><hr/>
                    <Reference numPlayers={this.props.ctx.numPlayers} step={this.props.G.step}/>
                </div>
                <div className="sidebar">
                    <Player player={this.props.G.players[this.props.playerID]} playerID={this.props.playerID}/>
                </div>
                <div className="action"></div>
            </div>
        )
    }
}