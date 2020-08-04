import React from 'react'

import { Bidder } from './bidder'
import { PlayerName, ResourceName } from './names'
import { CoilSlider } from './slider'
import { payment, playerSettings } from '../static/reference'
import { powerplants } from '../static/powerplants'

import PlayerModel from '../models/player'

import { AUCTION, BUREAUCRACY, CITY, REGIONS, RESOURCE } from '../Game'

import './styles/action.css'

export default function ActionBar(props) {
    let action
    let myTurn = true
    if (props.gameover) {
        const winners = props.gameover.winnerIDs
        if (winners.length === 1) {
            action = <span><PlayerName playerID={winners[0]} playerMap={props.playerMap}/>{ 'wins!'}</span>
        } else {
            const players = winners.map((id) => <PlayerName key={id} playerID={id} playerMap={props.playerMap}/>)
            action = <span>{'Tie Game! Players '}{players}{' win!'}</span>
        }
    } else if (props.playerStages) {
        // Handle staged turns separately.
        if (props.phase === BUREAUCRACY) {
            // Bureaucracy need special treatment, because all players are active.
            const poweredCount = props.player.bureaucracy.poweredCount
            const income = payment[poweredCount]
            if (props.player.bureaucracy.hasPowered) {
                myTurn = false
                action = <span>{`You earned $${income}. Wait for others to power.`}</span>
            } else if (props.player.bureaucracy.toPower.length === 0) {
                action = [
                    <span key="message">Choose powerplants to power using the player mat in the upper right.</span>,
                    <button key="pass" onClick={() => props.passPowering()}>Pass</button>
                ]
            } else if (props.playerStages[props.playerID] === 'coil') {
                const coilPlants = props.player.bureaucracy.toPower.filter(p => powerplants[p].resource === 'coil')
                const total = coilPlants.reduce((acc, p) => acc + powerplants[p].resourceCost, 0)
                const message = `Select resources to power PP${coilPlants.length > 1 ? 's' : ''} ${coilPlants.join(', ')}: `
                action = (
                    <CoilSlider 
                        player={props.player}
                        confirm={props.spendCoil}
                        total={total}
                        maxCoal={props.player.resources.coal}
                        maxOil={props.player.resources.oil}
                        message={message}
                    />
                )
            } else {
                action = [
                    <span key="message">{
                        `Use powerplant${props.player.bureaucracy.toPower.length > 1 ? 's' : ''} 
                        ${props.player.bureaucracy.toPower.join(', ')} to power ${poweredCount} 
                        cit${poweredCount !== 1 ? 'ies': 'y'} for $${income}?`
                    }</span>,
                    <button key="power" onClick={() => props.power()}>Power</button>,
                    <button key="clear" onClick={() => props.clearToPower()}>Clear</button>,
                ]
            }
            
        } else {
            // Otherwise, it is discard PP/discard resources. Only one player will be active.
            const currentPlayer = Object.keys(props.playerStages)[0]
            if (props.playerID !== currentPlayer) {
                myTurn = false
                action = <span>{'Wait for '}<PlayerName playerID={currentPlayer} playerMap={props.playerMap}/></span>
            } else if (props.playerStages[currentPlayer] === 'discardPP') {
                if (props.toDiscard) {
                    action = [
                        <span key="message">{`Discard powerplant ${props.toDiscard}? Note that you may need to discard excess resources.`}</span>,
                        <button key="confirm" onClick={() => props.discardPP()}>Confirm</button>
                    ]
                } else {
                    action = <span>Select a powerplant to discard.</span>
                }
            } else {
                action = action = (
                    <CoilSlider 
                        player={props.player}
                        confirm={props.discardResources}
                        total={(props.extraOil + props.extraCoal) - PlayerModel.getCapacity(props.player).coil}
                        maxCoal={props.extraCoal}
                        maxOil={props.extraOil}
                        message={'Discard coal and oil.'}
                    />
                )
            }
        }
    } else if (props.playerID !== props.currentPlayer) {
        myTurn = false
        action = <span>{'Wait for '}<PlayerName playerID={props.currentPlayer} playerMap={props.playerMap}/></span>
    } else {
        switch (props.phase) {
            case AUCTION:
                if (!props.upForAuction) {
                    if (!props.selectedPP) {
                        action = [
                            <span key="message">{`Select a powerplant${props.firstTurn ? '.' : ' or pass.'}`}</span>,
                            <button key="pass" onClick={() => props.passBuyPP()} disabled={props.firstTurn ? 'disabled' : ''}>Pass</button>
                        ]
                    } else {
                        action = [
                            <span key="message">{`Start the bidding on powerplant ${props.selectedPP}?`}</span>,
                            <button key="confirm" onClick={() => props.startBidding()}>Confirm</button>
                        ]
                    }
                } else {
                    action = <Bidder currentBid={props.currentBid} maxBid={props.budget} makeBid={props.makeBid} pass={props.passBid} powerplant={props.upForAuction}/>
                }
                break
            case CITY:
                if (Object.keys(props.selectedCities).length === 0) {
                    action = [<span key="message">Select cities or pass.</span>, <button key="pass" onClick={() => props.pass()}>Pass</button>]
                } else {
                    const cities = Object.keys(props.selectedCities).join(', ')
                    const cost = Object.values(props.selectedCities).map(i => i.cost).reduce((a,b) => a+b, 0) + props.connectionCost
                    action = [
                        <span key="message">{`Buy ${cities} for $${cost}?`}</span>,
                        <button disabled={props.budget >= cost ? '' : 'disabled'} key="buy" onClick={() => props.buyCities()}>Buy</button>,
                        <button key="clear" onClick={() => props.clearCities()}>Clear</button>,
                    ]
                }
                break
            case RESOURCE:
                if (props.resourceCost === 0){
                    action = [<span key="message">Select resources or pass.</span>, <button key="pass" onClick={() => props.pass()}>Pass</button>]
                } else {
                    let resources = []
                    for (const resource in props.selectedResources) {
                        if (props.selectedResources[resource] > 0) {
                            resources.push(<ResourceName key={resource} resource={resource} amount={props.selectedResources[resource]}/>)
                        }                       
                    }
                    action = [
                        <span key="message">{'Buy '}{resources}{`for $${props.resourceCost}?`}</span>,
                        <button disabled={props.budget >= props.resourceCost ? '' : 'disabled'} key="buy" onClick={() => props.buyResources()}>Buy</button>,
                        <button key="clear" onClick={() => props.clearResources()}>Clear</button>,
                    ]
                }
                break
            case REGIONS:
                const playerCount = Object.keys(props.playerMap).length
                if (props.regions.length === 0){
                    action = <span>{`Pick contiguous ${playerSettings[playerCount].regions} regions to play in.`}</span>
                } else {
                    let titleCasedRegions = props.regions.map(r => r[0].toUpperCase() + r.slice(1))
                    action = [
                        <span key="message">{`Play in ${titleCasedRegions.join(', ')}?`}</span>,
                        <button disabled={props.regions.length === playerSettings[playerCount].regions ? '' : 'disabled'} key="buy" onClick={() => props.confirmRegions()}>Confirm</button>,
                        <button key="clear" onClick={() => props.clearRegions()}>Clear</button>,
                    ]
                }
                break
            default:
                break
        }
    }
    return <div className={'action' + (myTurn ? ' action-my-turn' : '')}>{action}</div>
}