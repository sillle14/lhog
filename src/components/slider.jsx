import React from 'react'

import { ResourceName } from './names'
import { powerplants } from '../static/powerplants'

import './styles/slider.css'

/**
 * Slider object for choosing how to power coil plants.
 */
export class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {coal: 0};
        this.coilPlants = props.player.bureaucracy.toPower.filter(p => powerplants[p].resource === 'coil')
        this.total = this.coilPlants.reduce((acc, p) => acc + powerplants[p].resourceCost, 0)
        this.maxCoal = props.player.resources.coal
        this.maxOil = props.player.resources.oil
        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
        this.setState({coal: event.target.value})
    }
  
    render() {
        return (<div className="slider-box">
            <span>{`Select resources to power PP${this.coilPlants.length > 1 ? 's' : ''} ${this.coilPlants.join(', ')}: `}</span>
            <ResourceName resource="oil" amount={this.total - this.state.coal}/>
            <input className="slider" type="range" min="0" max={this.total} value={this.state.coal} onChange={this.handleChange}/>
            <ResourceName resource="coal" amount={this.state.coal}/>
            <button 
                onClick={() => this.props.spendCoil(this.state.coal, this.total - this.state.coal)} 
                disabled={this.maxOil >= this.total - this.state.coal && this.maxCoal >= this.state.coal ? '' : 'disabled'}
            >Confirm</button>
        </div>
        )
    }
}