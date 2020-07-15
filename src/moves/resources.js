import { INVALID_MOVE } from 'boardgame.io/core'

export function selectResource(G, ctx, resource) {
    G.selectedResources[resource] += 1

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