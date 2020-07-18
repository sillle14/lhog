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
    let marketLabels = [<span key="current">Current Market:</span>]
    let style = {'--pp-grid-width': '60%', '--pp-width': 'calc(100% / 3)'}
    if (props.step !== 3) {
        marketLabels.push(<span key="future">Future Market:</span>)
        style = {'--pp-grid-width': '80%', '--pp-width': '25%'}
    }
    return (
        <div name="ppMarket" className="powerplant-market" style={style}>
            <div className="market-labels">{marketLabels}</div>
            <div className="powerplant-grid">{powerplants}</div>
        </div>
    )
}