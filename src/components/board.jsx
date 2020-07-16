import React from 'react'
import { scroller } from 'react-scroll'

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

    scrollToElement(element) {
        scroller.scrollTo(element, {containerId: 'main-' + this.props.playerID})
    }

    componentDidMount() { this.scrollToElement(this.props.G.scrollTo) }

    componentDidUpdate(prevProps) { 
        if (prevProps.G.scrollTo !== this.props.G.scrollTo) {
            this.scrollToElement(this.props.G.scrollTo)
        }
    }

    render () {
        const myTurn = this.props.playerID === this.props.ctx.currentPlayer
        return (
            <div className="board">
                <div className="main" id={'main-' + this.props.playerID}>
                    <Market 
                        powerplantMarket={this.props.G.powerplantMarket} 
                        selected={this.props.G.auction.selected}
                        upForAuction={this.props.G.auction.upForAuction}
                        selectPowerplant={this.props.moves.selectPowerplant}
                        myTurn={myTurn}
                    /><hr/>
                    <Players 
                        players={this.props.G.players} 
                        playerMap={this.playerMap} 
                        currentPlayer={this.props.ctx.currentPlayer} 
                        phase={this.props.ctx.phase}
                    /><hr/>
                    <Map 
                        cityStatus={this.props.G.cityStatus}
                        selectedCities={Object.keys(this.props.G.selectedCities)}
                        myTurn={myTurn}
                        selectCity={this.props.moves.selectCity}
                        rerender={this.props.G.rerender}
                    /><hr/>
                    <ResourceMarket 
                        resourceMarket={this.props.G.resourceMarket}
                        selectResource={this.props.moves.selectResource}
                    /><hr/>
                    <Reference 
                        numPlayers={this.props.ctx.numPlayers} 
                        step={this.props.G.step}
                        playerOrder={this.props.G.playerOrder}
                        playerMap={this.playerMap}
                    />
                </div>
                <div className="sidebar">
                    <Player 
                        player={this.props.G.players[this.props.playerID]} 
                        playerID={this.props.playerID} 
                        playerMap={this.playerMap}
                        selectPP={this.props.moves.selectToPower}
                    />
                    <Logs logs={this.props.G.logs} playerMap={this.playerMap} playerID={this.props.playerID}/>
                </div>
                <ActionBar
                    // Basic
                    currentPlayer={this.props.ctx.currentPlayer}
                    playerID={this.props.playerID}
                    player={this.props.G.players[this.props.playerID]} 
                    playerMap={this.playerMap}
                    phase={this.props.ctx.phase}
                    firstTurn={this.props.G.firstTurn}
                    budget={this.props.G.players[this.props.playerID].money}
                    pass={this.props.moves.pass}

                    // Auction
                    selectedPP={this.props.G.auction.selected}
                    upForAuction={this.props.G.auction.upForAuction}
                    startBidding={this.props.moves.startBidding}
                    makeBid={this.props.moves.makeBid}
                    currentBid={this.props.G.auction.currentBid}
                    passBid={this.props.moves.passBid}
                    passBuyPP={this.props.moves.passBuyPP}
                    
                    // Buy cities
                    selectedCities={this.props.G.selectedCities}
                    connectionCost={this.props.G.connectionCost}
                    clearCities={this.props.moves.clearCities}
                    buyCities={this.props.moves.buyCities}

                    // Buy resources
                    selectedResources={this.props.G.selectedResources}
                    resourceCost={this.props.G.resourceCost}
                    clearResources={this.props.moves.clearResources}
                    buyResources={this.props.moves.buyResources}

                    // Bureaucracy
                    passPowering={this.props.moves.passPowering}
                    clearToPower={this.props.moves.clearToPower}
                />
            </div>
        )
    }
}