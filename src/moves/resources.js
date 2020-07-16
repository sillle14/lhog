import { INVALID_MOVE } from 'boardgame.io/core'
import PlayerModel from '../models/player'

export function selectResource(G, ctx, resource) {
    G.selectedResources[resource] += 1

    const capacity = PlayerModel.getCapacity(G.players[ctx.currentPlayer])
    let overflowCoil = 0

    // Easiest to just recalculate the resource cost entirely
    let resourceCost = 0
    for (const r in G.selectedResources) {
        // First check the capacity.
        if (G.selectedResources[r] > capacity[r]) {
            if (['coal', 'oil'].includes(r)) {
                overflowCoil += G.selectedResources[r] - capacity[r]
                if (overflowCoil > capacity['coil']) {
                    G.selectedResources[resource] -= 1
                    return INVALID_MOVE
                }
            } else {
                // No extra capacity for uranium and coal.
                G.selectedResources[resource] -= 1
                return INVALID_MOVE
            }
        }

        let selected = 0
        let i = 0
        // Iterate over all the resources, incrementing the selected count and the cost when the resource is available.
        while (selected < G.selectedResources[r]) {
            // If we've walked off the end of the array, we are requesting more than are available.
            if (G.resourceMarket[r][i] === undefined) {
                G.selectedResources[resource] -= 1
                return INVALID_MOVE
            }
            if (G.resourceMarket[r][i].available) {
                resourceCost += G.resourceMarket[r][i].cost
                selected += 1
            }
            i++
        }
    }

    G.resourceCost = resourceCost
}

export function clearResources(G, ctx) {
    G.selectedResources = {coal: 0, oil: 0, trash: 0, uranium: 0}
    G.resourceCost = 0
}

export function buyResources(G, ctx) {
    G.logs.push({playerID: ctx.currentPlayer, move: 'buyResources', resources: G.selectedResources, cost: G.resourceCost})

    for (const r in G.selectedResources) {
        G.players[ctx.currentPlayer].resources[r] += G.selectedResources[r]
        let resourceCount = G.selectedResources[r]
        // Iterate over the resource market until the appropriate number has been marked inactive.
        let i = 0
        while (resourceCount > 0) {
            if (G.resourceMarket[r][i].available) {
                G.resourceMarket[r][i].available = false
                resourceCount -= 1
            }
            i++
        }
    }
    G.players[ctx.currentPlayer].money -= G.resourceCost
    G.selectedResources = {coal: 0, oil: 0, trash: 0, uranium: 0}
    G.resourceCost = 0
    ctx.events.endTurn()
}