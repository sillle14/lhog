import { getPlayerOrder } from './playerOrder'
import { payment, playerSettings } from '../static/reference'
import { powerplants } from '../static/powerplants'
import { INVALID_MOVE } from 'boardgame.io/core'

export function startBureaucracy(G, ctx) {
    G.logs.push({move: 'startPhase', phase: 'Bureaucracy'})
    G.scrollTo = 'reference'
    for (const playerID in G.players) {
        G.players[playerID].bureaucracy.hasPowered = false
    }
}

export function selectToPower(G, ctx, powerplant) {
    const player = G.players[ctx.playerID]
    if (player.bureaucracy.hasPowered === true) {
        return INVALID_MOVE
    }
    // If already selected, unselect.
    if (player.bureaucracy.toPower.includes(powerplant)) {
        player.bureaucracy.toPower.splice(player.bureaucracy.toPower.indexOf(powerplant), 1)
        return
    }
    // Check that the player can afford to power all selected powerplants.
    let playerResources = {...player.resources}
    let coilCost = 0
    // Iterate through existing powerplants to calculate how many resources the player has left.
    let toPower = player.bureaucracy.toPower.concat([powerplant])
    for (let i = 0; i < toPower.length; i++) {
        const powerplant = powerplants[toPower[i]]
        if (powerplant.resource === 'coil') {
            coilCost += powerplant.resourceCost
        } else if (powerplant.resourceCost) {
            playerResources[powerplant.resource] -= powerplant.resourceCost
            if (playerResources[powerplant.resource] < 0) { return INVALID_MOVE }
        }
    }
    // Check if they have enough remaining to pay for the coil plants.
    if (playerResources['oil'] + playerResources['coal'] < coilCost) {
        return INVALID_MOVE
    }

    // Add the power plant and update the powered count.
    player.bureaucracy.toPower.push(powerplant)
    player.bureaucracy.poweredCount = Math.min(
        player.cities.length, 
        player.bureaucracy.toPower.map(p => powerplants[p].production).reduce((a,b) => a+b, 0)
    )
}

function _endPower(G, ctx) {
    G.logs.push({playerID: ctx.playerID, move: 'power', count: G.players[ctx.playerID].bureaucracy.poweredCount})
    G.players[ctx.playerID].money += payment[G.players[ctx.playerID].bureaucracy.poweredCount]
    G.players[ctx.playerID].bureaucracy.toPower = []
    G.players[ctx.playerID].bureaucracy.hasPowered = true
}

export function power(G, ctx) {
    const player = G.players[ctx.playerID]
    // Spend the resources for non-coil plants.
    for (let i = 0; i < player.bureaucracy.toPower.length; i++) {
        const powerplant = powerplants[player.bureaucracy.toPower[i]]
        if (powerplant.resource !== 'coil') {
            player.resources[powerplant.resource] -= powerplant.resourceCost
        }
    }
    if (player.bureaucracy.toPower.some(p => powerplants[p].resource === 'coil')) {
        ctx.events.setStage('coil')
    } else {
        _endPower(G, ctx)
    }
}

export function spendCoil(G, ctx, coal, oil) {
    G.players[ctx.playerID].resources['coal'] -= coal
    G.players[ctx.playerID].resources['oil'] -= oil
    _endPower(G, ctx)
}

export function clearToPower(G, ctx) {
    G.players[ctx.playerID].bureaucracy.toPower = []
    G.players[ctx.playerID].bureaucracy.poweredCount = 0
}

export function passPowering(G, ctx) {
    G.players[ctx.playerID].bureaucracy.poweredCount = 0
    _endPower(G, ctx)
}

export function endBureaucracy(G, ctx) {
    /************************
     *   REFILL RESOURCES   *
     ************************/

    for (const r in G.resourceMarket) {
        const onBoard = G.resourceMarket[r].filter(i => i.available).length
        const onPlayers = Object.values(G.players).reduce((acc, p) => acc + p.resources[r], 0)
        let toRefill = Math.min(G.resourceMarket[r].length - (onBoard + onPlayers), playerSettings[ctx.numPlayers].refill[G.step][r])
        console.log(`refilling ${toRefill} ${r}`)
        let i = G.resourceMarket[r].length - 1
        // Walk along the resource market, activating spaces as necessary.
        while (toRefill > 0) {
            if (!G.resourceMarket[r][i].available) {
                G.resourceMarket[r][i].available = true
                toRefill -= 1
            }
            i--
        }
    }

    /*********************
     *   UPDATE MARKET   *
     *********************/

    /********************
     *   PLAYER ORDER   *
     ********************/
    G.playerOrder = getPlayerOrder(G.players)
    G.logs.push({move: 'playerOrder', order: G.playerOrder})
}