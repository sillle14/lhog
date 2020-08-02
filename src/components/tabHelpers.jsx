import React from 'react'
import './styles/tabs.css'

export function TabPanel(props) {
    const active = props.currentTab === props.tab
    return (
        <div className={active ? 'tab-content': undefined} hidden={!active}>
            {props.children}
        </div>
    )
}

export function TabLabel(props) {
    return (
        <div className="tab-label">
            <span>{props.label}</span>
            {props.warning && <span className="tab-warning">&nbsp;(!)</span>}
        </div>
    )
}