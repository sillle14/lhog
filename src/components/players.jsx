import React from 'react'
import PowerPlant from './powerplant'
import './styles/player.css'
import './styles/symbols.css'
import { playerColors } from '../static/playerColors'
import PlayerModel from '../models/player'

export function Player(props) {
    const powerplants = props.player.powerplants.map((i) => <PowerPlant cost={i} key={i}/>)
    const colors = playerColors[props.playerID]
    const houseStyle = {backgroundColor: colors.houseBackground, color: colors.color}

    let resources = [
        <div className="player-resource" key="money">
            <span>{props.player.money + '$'}</span>
            <div className="player-symbol house" style={houseStyle}>{props.player.cities.length}</div>
        </div>
    ]

    const playerCapacity = PlayerModel.getCapacity(props.player)
    const coilCapacity = playerCapacity.coil

    for (const resource in props.player.resources) {
        const available = props.player.resources[resource]
        const capacity = playerCapacity[resource]
        const extra = ['oil', 'coal'].includes(resource) ? '(+' + coilCapacity + ')' : ''
        resources.push(
            <div className="player-resource" key={resource}>
            <span>{available + '/' + capacity + extra}</span>
            <div className={'player-symbol resource resource-' + resource}></div>
        </div>
        )
    }

    return (
        <div className="player-wrapper">
            <div className="player-aspect-box">
                <div className="player" style={{backgroundColor: colors.background}}>
                    <div className="player-info">
                        <span>{props.player.name}</span>
                        {resources}
                    </div>
                    <div className="player-powerplants">{powerplants}</div>
                </div>
            </div>
        </div>
    )
}

export function Players(props) {
    let players = []
    for (const playerID in props.players) {
        players.push(<Player player={props.players[playerID]} playerID={playerID} key={playerID}/>)
    }
    return (
        <div className="players">{players}</div>
    )
}