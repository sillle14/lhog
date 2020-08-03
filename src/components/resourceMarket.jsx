import React from 'react'

import './styles/symbols.css'
import './styles/resourceMarket.css'

function Resource(props) {
    let className = 'resource market-resource resource-' + props.resource
    if (!props.available) {
        className += ' resource-disabled'
    } else if (props.clickable) {
        className += ' resource-clickable'
    }
    return <div className={className}>{props.cost}</div>
}

export default function ResourceMarket(props) {
    let resources = {}
    for (const resource in props.resourceMarket) {
        resources[resource] = props.resourceMarket[resource].map( function (r, i) {
            return (<Resource
                resource={resource}
                cost={r.cost} 
                available={r.available} 
                key={i}
                clickable={props.clickable}
            />)
        })
    }
    resources.uranium.push(<div className="uranium-spacer" key="spacer"/>)
    const resourceRows = [<span className="resource-title" key="title">Resource Market</span>]
    for (const resource in resources) {
        resourceRows.push(<div key={resource} className="resource-market-row" onClick={() => props.selectResource(resource)}>{resources[resource]}</div>)
    }
    return (
        <div name="resourceMarket" className="resource-market">{resourceRows}</div>
    )
}