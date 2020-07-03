import React from 'react'
import PowerPlant from './powerplant'
import './styles/market.css'


export default function Market(props) {
    const powerplants = props.powerplants.map((i) => <PowerPlant cost={i} key={i}/>)
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