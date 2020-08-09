import React from 'react'
import { playerColors } from '../static/playerColors'
import './styles/names.css'

const resourceColorMap = {
    coal: 'rgb(116, 61, 39)',
    oil: 'black',
    trash: 'rgb(255, 255, 45)',
    uranium: 'red'
}

export function ResourceName(props) {
    return <span className="resource-name" style={{color: resourceColorMap[props.resource]}}>{`${props.amount} ${props.resource} `}</span>
}

export function PlayerName(props) {
    return <span className="player-name" style={{color: playerColors[props.playerID].houseBackground}}>{props.playerMap[props.playerID] + ' '}</span>
}