import React from 'react'
import { payment, playerSettings } from '../static/reference'
import './styles/symbols.css'
import './styles/reference.css'

function Payment(props) {
    let rows = []
    for (let i = 0; i < 7; i++) {
        rows.push(<tr key={i}>
            <td>{i}</td><td>{payment[i]}</td>
            <td>{i + 7}</td><td>{payment[i + 7]}</td>
            <td>{i + 14}</td><td>{payment[i + 14]}</td>
        </tr>)
    }
    const house = <div className="symbol-aspect-box"><div className="symbol house"></div></div>
    return (
        <div className="chart payment-chart">
            <span>Payment Reference</span>
            <table className="payment-table">
                <thead>
                    <tr><th>{house}</th><th>$</th><th>{house}</th><th>$</th><th>{house}</th><th>$</th></tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    )
}

function Refill(props) {
    let rows = []
    for (const resource in playerSettings[props.numPlayers].refill[1]) {
        rows.push(<tr key={resource}>
            <td className="resource-row"><div className="symbol-aspect-box"><div className={'symbol resource-' + resource}></div></div></td>
            <td>{playerSettings[props.numPlayers].refill[1][resource]}</td>
            <td>{playerSettings[props.numPlayers].refill[2][resource]}</td>
            <td>{playerSettings[props.numPlayers].refill[3][resource]}</td>
        </tr>)
    }
    return (
        <div className="chart refill-chart">
            <span>Refill Reference</span>
            <table className="refill-table">
                <thead>
                    <tr><th></th><th>S 1</th><th>S 2</th><th>S 3</th></tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
    )
}

function Other(props) {
    return (
        <div className="chart other-chart">
            <span>Other Reference</span>
            <table className="other-table">
                <thead><tr><th></th><th></th></tr></thead>
                <tbody>
                    <tr><td>Current Step</td><td>{props.step}</td></tr>
                    <tr><td>Cities for Step 2</td><td>{playerSettings[props.numPlayers].step2}</td></tr>
                    <tr><td>Cities for End</td><td>{playerSettings[props.numPlayers].end}</td></tr>
                </tbody>
            </table>
        </div>
    )

}

export default function Reference(props) {
    return (
        <div id="reference">
            <Payment/>
            <Refill numPlayers={props.numPlayers}/>
            <Other numPlayers={props.numPlayers} step={props.step}/>
        </div>
    )
}