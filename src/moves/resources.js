import { INVALID_MOVE } from 'boardgame.io/core'

export function selectResource(G, ctx, resource) {
    G.selectedResources[resource] += 1

    // TODO: Disallow if over capacity.

    // Easiest to just recalculate the resource cost entirely
    let resourceCost = 0
    for (const r in G.selectedResources) {
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