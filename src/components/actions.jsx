import React from 'react'
import './styles/action.css'


class Bidder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bid: props.currentBid + 1};
  
        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
        this.setState({bid: event.target.value.replace(/\D/,'')})
    }
  
    render() {
        const validBid = this.state.bid >= this.props.currentBid && this.state.bid <= this.props.maxBid ? '' : 'disabled'
        return (
            <div className="bidder">
                <span>{'Bid more than ' + this.props.currentBid + ' or pass.'}</span>
                <input type="text" value={this.state.bid} onChange={this.handleChange}/>
                <button disabled={validBid} onClick={() => this.props.makeBid(this.state.bid)}>{'Bid ' + this.state.bid}</button>
                <button>Pass</button>
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
                action = <span>Select a powerplant.</span>
            } else {
                action = [
                    <span key="message">{'Start the bidding on powerplant ' + props.selectedPP + '?'}</span>,
                    <button key="confirm" onClick={() => props.startBidding()}>Confirm</button>
                ]
            }
        } else {
            action = <Bidder currentBid={props.currentBid} maxBid={props.budget} makeBid={props.makeBid}/>
        }
    }
    return (
        <div className="action">
            {action}
        </div>
    )
}