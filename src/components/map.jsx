import React from 'react'
import './styles/map.css'
import { cities } from '../static/cities'
import { edges } from '../static/edges'

import { GraphView } from 'react-digraph';


const houseCosts = [10, 15, 20]

const regionColors = {
    northwest: '#f2bfff',
    southwest: '#42e6f5',
    texas: '#ffa699',
    midwest: '#f8ff94',
    southeast: '#9beba1',
    northeast: '#e8c87d',
}

  
const EdgeTypes = {
    edge: { 
        shapeId: "#edge",
        shape: (
            <symbol viewBox="0 0 50 50" id="edge" key="0">
            <circle cx="25" cy="25" r="4" stroke="lightgrey" fill="currentColor"> </circle>
            </symbol>
        )
    }
}

function City() {
    const cityPosition = {
        10: {x: 50, y: 23},
        15: {x: 25, y: 52},
        20: {x: 75, y: 52}
    }

    const innerRadius = 18

    const houseClip = "polygon(50% 15%, 80% 33%, 80% 75%, 20% 75%, 20% 33%)"

    return (
        <symbol viewBox="0 0 100 100" id="other" key="0" height="100" width="100">
            <circle id="outer" cx="50" cy="50" r="50" style={{fill: "var(--region-color)"}}></circle>
            <circle cx={cityPosition[10]['x']} cy={cityPosition[10]['y']} r={innerRadius} fill="lightgrey" stroke="black"></circle>
            <text x={cityPosition[10]['x']} y={cityPosition[10]['y']} textAnchor="middle" fill="black" alignmentBaseline="central">10</text>
            <circle cx={cityPosition[15]['x']} cy={cityPosition[15]['y']} r={innerRadius} fill="lightgrey" stroke="black">20</circle>
            <text x={cityPosition[15]['x']} y={cityPosition[15]['y']} textAnchor="middle" fill="black" alignmentBaseline="central">15</text>
            <circle cx={cityPosition[20]['x']} cy={cityPosition[20]['y']} r={innerRadius} fill="lightgrey" stroke="black">15</circle>
            <text x={cityPosition[20]['x']} y={cityPosition[20]['y']} textAnchor="middle" fill="black" alignmentBaseline="central">20</text>

            <circle 
                cx={cityPosition[10]['x']}
                cy={cityPosition[10]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-10-display)", fill: "var(--house-10-color"}}
            ></circle>
             <circle 
                cx={cityPosition[15]['x']}
                cy={cityPosition[15]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-15-display)", fill: "var(--house-15-color"}}
            ></circle>
            <circle 
                cx={cityPosition[20]['x']}
                cy={cityPosition[20]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-20-display)", fill: "var(--house-20-color"}}
            ></circle>
        </symbol>
    )
}

const NODE_KEY = "id"       // Allows D3 to correctly update DOM
const doNothing = () => {}
const renderDefs = () => <defs><City></City></defs>
// I want this text to be on top of edges...https://github.com/uber/react-digraph/issues/213
const renderNodeText = (data, id, isSelected) => {
    return (
        <text textAnchor="middle">
            <tspan x="0" dy="36" fontSize="20">{data.id}</tspan>
        </text>
    )
}

const northwest = 'M -10 -60 L 750 -60 L 775 100 L 1040 230 L 1040 325 L 660 420 L 510 255 L -50 255 ' +
' L -55 220 Q -45 110 -55 -20 L 50 0 Z'
const southwest = 'M -50 265 L 505 265 L 657 432 L 850 382 L 830 800 q -10 0 -20 15 l -40 -20 l -3 -15 ' +
'l -45 -45 l -50 0 l 0 18 l -175 0 l -150 -65 L 250 700 L 100 625 L 0 500 l -40 -60 c 0 0 10 -55 -20 -75 ' +
'l 18 -65 Z'

const renderBackground = (gridSize) => {
    return (
        <g>
            <path d={northwest} fill={regionColors['northwest']} fillOpacity="0.3" stroke={regionColors['northwest']} strokeWidth="4"></path>
            <path d={southwest} fill={regionColors['southwest']} fillOpacity="0.3" stroke={regionColors['southwest']} strokeWidth="4"></path>
        </g>
    )
}

export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.renderNode = this.renderNode.bind(this)
    }

    renderNode (nodeRef, data, index, selected, hovered) {
        // TODO: Use inline rather than classes here, seems a bit cleaner
        let className = 'node'
        let style = {'--region-color': regionColors[data.region]}

        for (let i = 0; i < houseCosts.length; i ++) {
            const houseColor = this.props.cityStatus[data.id]['house' + houseCosts[i]]
            style['--house-' + houseCosts[i] + '-display'] = houseColor === null ? 'none' : 'default'
            style['--house-' + houseCosts[i] + '-color'] = houseColor
        }

        return <use x="-50" y="-50" xlinkHref="#other"className={className} style={style}/>
    }

    render() {
        // TODO: Background click gives console error
        // TODO: Render the US map in the background for bonus points
        return (
        <div id='graph'>
            
            <GraphView  readOnly={true}
                        nodeKey={NODE_KEY}
                        edgeArrowSize={0}
                        edgeHandleSize={150}
                        showGraphControls={false}
                        nodes={cities}
                        edges={edges}
                        edgeTypes={EdgeTypes}
                        renderNode={this.renderNode}
                        renderNodeText={renderNodeText}
                        renderDefs={renderDefs}

                        // TODO
                        //gridDotSize={0}
                        gridSpacing={50}
                        initialBBox={{x: 0, y: -100, width: 2000, height: 1000}} // TODO: Set this accurately
                        selected={{}}
                        onSelectNode={this.onSelectNode}
                        renderBackground={renderBackground}

                        // Not needed
                        nodeTypes={{}}
                        nodeSubtypes={{}}
                        onUpdateNode={doNothing}
                        onDeleteNode={doNothing}
                        onSelectEdge={doNothing}
                        onCreateEdge={doNothing}
                        onSwapEdge={doNothing}
                        onDeleteEdge={doNothing}
                        onBackgroundClick={(x,y) => {console.log(x + ',' + y)}}/>
        </div>
        );
    }

}