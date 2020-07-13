import { houseCosts } from '../static/cities'
import { edgeLookup } from '../static/edges'
import { INVALID_MOVE } from 'boardgame.io/core'

const MAX_CONN = 100

export function selectCity(G, ctx, city) {
    if (G.selectedCities.map(i => i.city).includes(city)) {
        return INVALID_MOVE
    }
    const player = G.players[ctx.currentPlayer]
    let connectionCost = MAX_CONN
    // If any cities are already owned or selected, we need to check if the new city is adjacent.
    if (player.cities.length > 0 || G.selectedCities.length > 0) {
        const effectiveCities = player.cities.concat(G.selectedCities.map(i => i.city))
        // TODO: This could lead to an inefficient connection cost if you don't buy cities in the right order.
        //       But it's somewhat tricky to really fix this, maybe later.
        for (let i = 0; i < effectiveCities.length; i++) {
            if (city in edgeLookup[effectiveCities[i]]) {
                if (edgeLookup[effectiveCities[i]][city] < connectionCost) { connectionCost = edgeLookup[effectiveCities[i]][city] }
            }
        }
        // If no connection was found, the city isn't adjacent.
        if (connectionCost === MAX_CONN) {
            return INVALID_MOVE
        }
    } else {
        connectionCost = 0
    }
    const nextAvailable = G.cityStatus[city].findIndex(i => i === null)
    if (nextAvailable >= G.step) {
        return INVALID_MOVE
    }
    const cost = houseCosts[nextAvailable] + connectionCost
    G.selectedCities.push({city: city, cost: cost})
}

export function clearCities(G, ctx) {
    G.selectedCities = []
}

export function buyCities(G, ctx) {
    // TODO
}