import { getPlayerOrder } from './common'
import { payment, playerSettings } from '../static/reference'
import { powerplants, STEP_3 } from '../static/powerplants'
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
        player.bureaucracy.poweredCount = Math.min(
            player.cities.length, 
            player.bureaucracy.toPower.map(p => powerplants[p].production).reduce((a,b) => a+b, 0)
        )
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
     *   CHECK FOR WINNER   *
     ************************/

    if (G.endGame) {
        let winnerIDs = []
        let winnerInfo = {powered: 0, money: 0, cities: 0}
        for (const player in G.players) {
            let isWinner = false
            let isTier = false
            // If the player has powered more cites, they are the new winner.
            if (G.players[player].bureaucracy.poweredCount > winnerInfo.powered) {
                isWinner = true
            } else if (G.players[player].bureaucracy.poweredCount === winnerInfo.powered) {
                if (G.players[player].money > winnerInfo.money) {
                    isWinner = true
                } else if (G.players[player].money === winnerInfo.money) {
                    if (G.players[player].cities.length > winnerInfo.cities) {
                        isWinner = true
                    } else if (G.players[player].cities.length === winnerInfo.cities) {
                        isTier = true
                    }
                }
            }
            if (isWinner) {
                winnerIDs = [player]
                winnerInfo = {
                    powered: G.players[player].bureaucracy.poweredCount, 
                    money: G.players[player].money, 
                    cities: G.players[player].cities.length
                }
            } else if (isTier) {
                winnerIDs.push(player)
            }
        }
        G.logs.push({move: 'endGame', winnerIDs: winnerIDs})
        ctx.events.endGame({winnerIDs: winnerIDs})
        return
    }

    /************************
     *   REFILL RESOURCES   *
     ************************/

    for (const r in G.resourceMarket) {
        const onBoard = G.resourceMarket[r].filter(i => i.available).length
        const onPlayers = Object.values(G.players).reduce((acc, p) => acc + p.resources[r], 0)
        let toRefill = Math.min(G.resourceMarket[r].length - (onBoard + onPlayers), playerSettings[ctx.numPlayers].refill[G.step][r])
        G.logs.push({move: 'refill', resource: r, amount: toRefill})
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

    if (G.step !== 3) {
        G.powerplantsStep3.push(G.powerplantMarket[7])
        G.powerplantMarket[7] = G.powerplantDeck.pop()
        G.powerplantMarket.sort((a,b) => a-b)
        // If we've drawn step 3, start the next step.
        if (G.powerplantMarket[7] === STEP_3) {
            G.powerplantDeck = ctx.random.Shuffle(G.powerplantsStep3)
            G.logs.push({move: 'step', removed: G.powerplantMarket[0], step: 3})
            // Remove the most expensive and least expensive powerplants. Note that the most expensive will always
            //  be the step 3 card.
            G.powerplantMarket = G.powerplantMarket.slice(1, 7)
            G.step = 3
        }
    } else {
        // Swap out the lowest powerplant with a new powerplant.
        const nextPlant = G.powerplantDeck.pop()
        if (nextPlant) {
            G.powerplantMarket[0] = nextPlant
        } else {
            G.powerplantMarket.splice(0, 1)
        }
        G.powerplantMarket.sort((a,b) => a-b)
    }

    /********************
     *   PLAYER ORDER   *
     ********************/

    G.playerOrder = getPlayerOrder(G.players)
    G.logs.push({move: 'playerOrder', order: G.playerOrder})

    for (const player in G.players) {
        G.players[player].bureaucracy.hasPowered = false
    }
}