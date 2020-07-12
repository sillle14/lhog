import React from 'react'
import { animateScroll } from 'react-scroll'
import './styles/logs.css'
import { playerColors } from '../static/playerColors'

const indent = <span key="span">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

function PlayerName(props) {
    return <span className="player-name" style={{color: playerColors[props.playerID].houseBackground}}>{props.playerMap[props.playerID] + ' '}</span>
}

function Log(props) {
    const log = props.log
    const playerName = <PlayerName playerID={log.playerID} playerMap={props.playerMap}/>
    let details
    switch (log.move) {
        case 'playerOrder':
            const players = log.order.map((id) => <PlayerName key={id} playerID={id} playerMap={props.playerMap}/>)
            details = [
                <span key="header">Setting Player Order:</span>,
                <br key="br"></br>,
                <span key="order">{indent}{players}</span>
            ]
            break
        case 'startAuction':
            details = <span>{playerName}{'starts the bidding on PP ' + log.powerplant}</span>
            break
        case 'bid':
            details = <span>{indent}{playerName}{'bids ' + log.bid + '$'}</span>
            break
        case 'passAuction':
            details = <span>{indent}{playerName}{' passes'}</span>
            break
        case 'passBuy':
            details = <span>{playerName}{' passes'}</span>
            break
        case 'buyPP':
            details = <span>{playerName}{' buys PP ' + log.powerplant + ' for ' + log.cost + '$'}</span>
            break
        default:
            break
    }

    return <div>{details}</div>
}

export class Logs extends React.Component {

    constructor(props) {
        super(props);
        this.bottom = React.createRef();
    }

    scrollToBottom = () => {
        animateScroll.scrollToBottom({containerId: this.props.playerID + '-log', duration: 0});
    }
    
    componentDidMount() { this.scrollToBottom() }

    componentDidUpdate(prevProps) { 
        if (this.props.logs.length !== prevProps.logs.length) {
            this.scrollToBottom() 
        }
    }

    render () {
        let logs = []
        for (let i = this.props.logs.length - 1; i >= 0; i--) {
            logs.push(<Log key={i} log={this.props.logs[i]} playerMap={this.props.playerMap}></Log>)
        }
    
        return (
            <div className="logs">
                <span>Game Log:</span>
                <hr className="log-break"></hr>
                <div className="scroll" id={this.props.playerID + '-log'}>
                    {logs}
                </div>
            </div>
        )
    }
}