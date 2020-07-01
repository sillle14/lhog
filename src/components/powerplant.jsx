import React from 'react'
import { powerplants } from '../static/powerplants'
import './styles/powerplant.css'
import './styles/symbols.css'

function Arrow(props) {
    return (
        <svg viewBox="0 0 80 60" height="60%">
            <path d="M 10 10 l 30 0 l -10 20 l 20 0 l 5 -10 l 25 15 -25 15 l -5 -10 L 15 40 l 10 -20 l -15 0 Z" fill="white"></path>
        </svg>
    )
}

function PowerPlantProduction(props) {
    return (
        <div className="powerplant-production">
            <div className={'resource resource-powerplant resource-' + props.resource}>{props.resourceCost}</div>
            <Arrow/>
            <div className="house">{props.production}</div>
        </div>
    )
}

export default function PowerPlant(props) {
    const powerplant = powerplants[props.cost]
    return (
        <div className="powerplant-wrapper">
            <div className={'powerplant-aspect-box'}>
                <div className={'powerplant powerplant-' + powerplant.resource}>
                    <span>{props.cost}</span>
                    <PowerPlantProduction
                        className="powerplant-production" 
                        resource={powerplant.resource} 
                        resourceCost={powerplant.resourceCost}
                        production={powerplant.production}
                    ></PowerPlantProduction>
                </div>
            </div>
        </div>
    )
}