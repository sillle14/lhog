import React from 'react'

import { ResourceName } from './names'

import './styles/slider.css'

/**
 * Slider object for choosing between coal and oil.
 */
export class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {coal: 0};
        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
        this.setState({coal: event.target.value})
    }
  
    render() {
        return (<div className="slider-box">
            <span>{this.props.message}</span>
            <ResourceName resource="oil" amount={this.props.total - this.state.coal}/>
            <input className="slider" type="range" min="0" max={this.props.total} value={this.state.coal} onChange={this.handleChange}/>
            <ResourceName resource="coal" amount={this.state.coal}/>
            <button 
                onClick={() => this.props.confirm(this.state.coal, this.props.total - this.state.coal)} 
                disabled={this.props.maxOil >= this.props.total - this.state.coal && this.props.maxCoal >= this.state.coal ? '' : 'disabled'}
            >Confirm</button>
        </div>
        )
    }
}