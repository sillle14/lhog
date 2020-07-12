import React from 'react'
import './styles/action.css'


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

export default function ActionBar(props) {
    let action
    if (!props.myTurn) {
        action = <span>Wait your turn!</span>
    } else if (props.phase === 'auction') {
        if (!props.upForAuction) {
            if (!props.selectedPP) {
                action = [
                    <span key="message">{'Select a powerplant' + (props.firstTurn ? '' : ' or pass.')}</span>,
                    <button key="pass" onClick={() => props.passBuy()} disabled={props.firstTurn ? 'disabled' : ''}>Pass</button>
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
    } else if (props.phase === 'cities') {
        action = <span>Select a City.</span>
    }
    return (
        <div className="action">
            {action}
        </div>
    )
}