import React from 'react'
import PowerPlant from './powerplant'
import './styles/market.css'


export default function Market(props) {
    let powerplants = []
    for (let i = 0; i < props.powerplantMarket.length; i++) {
        const cost = props.powerplantMarket[i]
        const selected = props.upForAuction === cost || (props.selected === cost && props.myTurn)
        powerplants.push(
            <PowerPlant cost={cost} key={i} selected={selected} select={props.selectPowerplant}/>
        )
    }
    return (
        <div className="powerplant-market">
            <div className="market-labels">
                <span>Current Market:</span>
                <span>Future Market:</span>
            </div>
            <div className="powerplant-grid">
                {powerplants}
            </div>
        </div>
    )
}