import React from 'react'
import PowerPlant from './powerplant'
import './styles/player.css'
import './styles/symbols.css'
import { playerColors } from '../static/playerColors'

export function PlayerName(props) {
    return <span className="player-name" style={{color: playerColors[props.playerID].houseBackground}}>{props.playerMap[props.playerID] + ' '}</span>
}

export function Player(props) {
    const powerplants = props.player.powerplants.map(function (i) {
        return (
            <PowerPlant 
                cost={i} 
                key={i} 
                selected={props.player.ppToPower.includes(i) && props.selectPP} 
                select={props.selectPP}
            />      
        )
    })
    const colors = playerColors[props.playerID]
    const houseStyle = {backgroundColor: colors.houseBackground, color: colors.color}

    let resources = [
        <div className="player-resource" key="money">
            <div className="player-symbol house" style={houseStyle}>{props.player.cities.length}</div>
            <span>{props.player.money + '$'}</span>
        </div>
    ]

    for (const resource in props.player.resources) {
        const available = props.player.resources[resource]
        resources.push(
            <div className="player-resource" key={resource}>
            <div className={'player-symbol resource resource-' + resource}>{available}</div>
        </div>
        )
    }

    return (
        <div className="player-wrapper">
            <div className={'player-aspect-box' + (props.selected ? ' selected' : '')}>
                <div className="player" style={{backgroundColor: colors.background}}>
                    <div className="player-info">
                        <PlayerName playerID={props.playerID} playerMap={props.playerMap}/>
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
        players.push(
        <Player
            player={props.players[playerID]} 
            playerID={playerID} 
            key={playerID} 
            playerMap={props.playerMap} 
            selected={props.currentPlayer === playerID && props.phase !== 'bureaucracy'}  // No single player active in bureacracy
        />) 
    }
    return (
        <div className="players">{players}</div>
    )
}