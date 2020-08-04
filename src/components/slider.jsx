import React from 'react'
import Slider from '@material-ui/core/Slider';

import { ResourceName } from './names'

import './styles/slider.css'

/**
 * Slider object for choosing between coal and oil.
 */
export class CoilSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {coal: 0};
        this.handleChange = this.handleChange.bind(this);
        this.sliderClasses = {
            root: 'slider',
            mark: 'slider-mark',
            markActive: 'slider-mark',
            rail: 'slider-rail',
            track: 'slider-track',
            thumb: 'slider-thumb'
        }
    }
  
    handleChange(event, newValue) {
        this.setState({coal: newValue})
    }
  
    render() {
        return (<div className="slider-box">
            <span>{this.props.message}</span>
            <ResourceName resource="oil" amount={this.props.total - this.state.coal}/>
            <Slider value={this.state.coal} onChange={this.handleChange} min={0} max={this.props.total} marks={true} classes={this.sliderClasses}/>
            <ResourceName resource="coal" amount={this.state.coal}/>
            <button 
                onClick={() => this.props.confirm(this.state.coal, this.props.total - this.state.coal)} 
                disabled={this.props.maxOil >= this.props.total - this.state.coal && this.props.maxCoal >= this.state.coal ? '' : 'disabled'}
            >Confirm</button>
        </div>
        )
    }
}