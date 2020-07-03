import React from 'react'
import './styles/symbols.css'
import './styles/resourceMarket.css'

function Resource(props) {
    let className = 'resource market-resource resource-' + props.resource
    if (!props.available) {
        className += ' resource-disabled'
    }
    return (
        <div className="resource-wrapper">
            <div className="resource-aspect-box">
                <div className={className}>{props.cost}</div>
            </div>
        </div>
    )
}

export default function ResourceMarket(props) {
    let coal = []
    let oil = []
    let trash = []
    let uranium = []
    for (let i = 0; i < 24; i++) {
        coal.push(<Resource
            resource="coal"
            cost={props.coalMarket[i].cost} 
            available={props.coalMarket[i].available} 
            key={i}
        />)
        oil.push(<Resource
            resource="oil"
            cost={props.oilMarket[i].cost} 
            available={props.oilMarket[i].available} 
            key={i}
        />)
        trash.push(<Resource
            resource="trash"
            cost={props.trashMarket[i].cost} 
            available={props.trashMarket[i].available} 
            key={i}
        />)
        if (i < 12) {
            uranium.push(<Resource
                resource="uranium"
                cost={props.uraniumMarket[i].cost} 
                available={props.uraniumMarket[i].available} 
                key={i}
            />)
        }
    }
    return (
        <div id="resource-market">
            <div className="resource-market-row">{coal}</div>
            <div className="resource-market-row">{oil}</div>
            <div className="resource-market-row">{trash}</div>
            <div className="resource-market-row">{uranium}</div>
        </div>
    )
}