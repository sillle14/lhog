import React from 'react'
import { PlayerName } from './players' 
import './styles/action.css'

const resourceColorMap = {
    coal: 'brown',
    oil: 'black',
    trash: 'rgb(255, 255, 45)',
    uranium: 'red'
}

export function ResourceName(props) {
    return <span className="resource-name" style={{color: resourceColorMap[props.resource]}}>{props.amount + ' ' + props.resource + ' '}</span>
}

class Bidder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bid: parseInt(props.currentBid) + 1};
  
        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
        this.setState({bid: event.target.value.replace(/\D/,'')})
    }
  
    render() {
        const validBid = this.state.bid > this.props.currentBid && this.state.bid <= this.props.maxBid
        const passAllowed = this.props.currentBid >= this.props.powerplant
        return (
            <div className="bidder">
                <span>{'Bid more than ' + this.props.currentBid + ' on PP ' + this.props.powerplant + (passAllowed ? ' or pass.' : '')}</span>
                <input type="text" value={this.state.bid} onChange={this.handleChange}/>
                <button disabled={validBid ? '' : 'disabled'} onClick={() => this.props.makeBid(this.state.bid)}>{'Bid ' + this.state.bid}</button>
                <button disabled={passAllowed ? '' : 'disabled'} onClick={() => this.props.pass()}>Pass</button>
            </div>
        )
    }
}

// TODO: Use backtick strings
export default function ActionBar(props) {
    let action
    // Bureaucracy need special treatment because all players are active.
    // TODO: Use pps 1,2, and 10 to power X cities for Y$
    if (props.phase === 'bureaucracy') {
        if (props.player.hasPowered) {
            action = <span>{`You earned ${props.player.lastIncome}$. Wait for others to power.`}</span>
        } else if (props.player.ppToPower.length === 0) {
            action = [
                <span key="message">Choose powerplants to power using the player mat in the upper right.</span>,
                <button key="pass" onClick={() => props.passPowering()}>Pass</button>
            ]
        } else {
            action = [
                <span key="message">{`Use powerplant${props.player.ppToPower.length > 1 ? 's' : ''} ${props.player.ppToPower.join(', ')} to power ${1} city for ${10}$?`}</span>,
                <button key="power" onClick={() => props.power()}>Power</button>,
                <button key="clear" onClick={() => props.clearToPower()}>Clear</button>,
            ]
        }
        
    } else if (props.playerID !== props.currentPlayer) {
        action = <span>{'Wait for '}<PlayerName playerID={props.currentPlayer} playerMap={props.playerMap}/></span>
    } else {
        switch (props.phase) {
            case 'auction':
                if (!props.upForAuction) {
                    if (!props.selectedPP) {
                        action = [
                            <span key="message">{'Select a powerplant' + (props.firstTurn ? '' : ' or pass.')}</span>,
                            <button key="pass" onClick={() => props.passBuyPP()} disabled={props.firstTurn ? 'disabled' : ''}>Pass</button>
                        ]
                    } else {
                        action = [
                            <span key="message">{'Start the bidding on powerplant ' + props.selectedPP + '?'}</span>,
                            <button key="confirm" onClick={() => props.startBidding()}>Confirm</button>
                        ]
                    }
                } else {
                    action = <Bidder currentBid={props.currentBid} maxBid={props.budget} makeBid={props.makeBid} pass={props.passBid} powerplant={props.upForAuction}/>
                }
                break
            case 'cities':
                if (Object.keys(props.selectedCities).length === 0) {
                    action = [<span key="message">Select a city or pass.</span>, <button key="pass" onClick={() => props.pass()}>Pass</button>]
                } else {
                    const cities = Object.keys(props.selectedCities).join(', ')
                    const cost = Object.values(props.selectedCities).map(i => i.cost).reduce((a,b) => a+b, 0) + props.connectionCost
                    action = [
                        <span key="message">{'Buy ' + cities + ' for ' + cost + '$?'}</span>,
                        <button disabled={props.budget >= cost ? '' : 'disabled'} key="buy" onClick={() => props.buyCities()}>Buy</button>,
                        <button key="clear" onClick={() => props.clearCities()}>Clear</button>,
                    ]
                }
                break
            case 'resources':
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
                        <span key="message">{'Buy '}{resources}{'for ' + props.resourceCost + '$?'}</span>,
                        <button disabled={props.budget >= props.resourceCost ? '' : 'disabled'} key="buy" onClick={() => props.buyResources()}>Buy</button>,
                        <button key="clear" onClick={() => props.clearResources()}>Clear</button>,
                    ]
                }
                break
            default:
                break
        }
    }
    return <div className="action">{action}</div>
}