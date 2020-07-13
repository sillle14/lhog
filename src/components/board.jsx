import React from 'react'
import Map from './map'
import Market from './market'
import ResourceMarket from './resourceMarket'
import Reference from './reference'
import ActionBar from './actions'
import { Logs } from './logs'
import { Players, Player}  from './players'
import './styles/board.css'

export class WattMatrixTable extends React.Component {

    constructor(props) {
        super(props)
        this.playerMap = {}
        if (this.props.gameMetadata) {
            for (let i = 0; i < this.props.gameMetadata.length; i ++) {
                // Limit to 10 characters
                this.playerMap[this.props.gameMetadata[i].id] = this.props.gameMetadata[i].name.slice(0, 10)
            }
        } else {
            for (let i = 0; i < this.props.ctx.numPlayers; i ++) {
                this.playerMap[i] = 'Player ' + i
            }
        }
    }

    render () {
        const myTurn = this.props.playerID === this.props.ctx.currentPlayer
        // TODO: Style the scrollbar so it always shows up against the white map bette
        return (
            <div className="board">
                <div className="main">
                    <Market 
                        powerplantMarket={this.props.G.powerplantMarket} 
                        selected={this.props.G.auction.selected}
                        upForAuction={this.props.G.auction.upForAuction}
                        selectPowerplant={this.props.moves.selectPowerplant}
                        myTurn={myTurn}
                    /><hr/>
                    <Players players={this.props.G.players}/><hr/>
                    <Map 
                        cityStatus={this.props.G.cityStatus}
                        playerID={this.props.playerID}
                        selectedCities={Object.keys(this.props.G.selectedCities)}
                        myTurn={myTurn}
                        selectCity={this.props.moves.selectCity}
                        rerender={this.props.G.rerender}
                    /><hr/>
                    <ResourceMarket
                        coalMarket={this.props.G.coalMarket}
                        oilMarket={this.props.G.oilMarket}
                        trashMarket={this.props.G.trashMarket}
                        uraniumMarket={this.props.G.uraniumMarket}
                    /><hr/>
                    <Reference 
                        numPlayers={this.props.ctx.numPlayers} 
                        step={this.props.G.step}
                        playerOrder={this.props.G.playerOrder}
                    />
                </div>
                <div className="sidebar">
                    <Player player={this.props.G.players[this.props.playerID]} playerID={this.props.playerID}/>
                    <Logs logs={this.props.G.logs} playerMap={this.playerMap} playerID={this.props.playerID}/>
                </div>
                <ActionBar
                    myTurn={myTurn}
                    phase={this.props.ctx.phase}
                    selectedPP={this.props.G.auction.selected}
                    upForAuction={this.props.G.auction.upForAuction}
                    startBidding={this.props.moves.startBidding}
                    makeBid={this.props.moves.makeBid}
                    currentBid={this.props.G.auction.currentBid}
                    budget={this.props.G.players[this.props.playerID].money}
                    passBid={this.props.moves.passBid}
                    passBuy={this.props.moves.passBuyPP}
                    firstTurn={this.props.G.firstTurn}
                    selectedCities={this.props.G.selectedCities}
                    connectionCost={this.props.G.connectionCost}
                    clearCities={this.props.moves.clearCities}
                    buyCities={this.props.moves.buyCities}
                />
            </div>
        )
    }
}