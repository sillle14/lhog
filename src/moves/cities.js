import { houseCosts } from '../static/cities'
import { edgeLookup } from '../static/edges'
import { STEP_3 } from '../static/powerplants'
import { playerSettings } from '../static/reference'
import { INVALID_MOVE } from 'boardgame.io/core'

/* A modified version of Prim's MST algorithm so we can start with some nodes already connected.
 * This is used to find the cheapest way to connect a group of new nodes.
 *
 * @param nodeMap: A map of cities to the cost to connect that city to the existing network.
*/
function getMST(nodeMap) {
    let cost = 0
    // While there are new nodes, add the newest node to the network.
    while (Object.keys(nodeMap).length > 0) {
        let minEdgeCost = Infinity
        let cheapestNode
        for (const node in nodeMap) {
            if (nodeMap[node] < minEdgeCost) {
                minEdgeCost = nodeMap[node]
                cheapestNode = node
            }
        }
        // If the cheapest node still can't be connected, the nodes are disconnected.
        if (minEdgeCost === Infinity) {
            throw new Error('disconnected')
        }
        // Connect the cheapest node, remove it from the list of nodes, and update all remaining nodes.
        cost += minEdgeCost
        delete(nodeMap[cheapestNode])
        for (const adjacentCity in edgeLookup[cheapestNode]) {
            if (adjacentCity in nodeMap && edgeLookup[cheapestNode][adjacentCity] < nodeMap[adjacentCity]) {
                nodeMap[adjacentCity] = edgeLookup[cheapestNode][adjacentCity]
            }
        }
    }
    return cost
}

export function selectCity(G, ctx, city) {
    // If the city has already been selected this turn, or is already owned by the player, it is an invalid move.
    if (city in G.selectedCities || G.cityStatus[city].includes(ctx.currentPlayer)) {
        return INVALID_MOVE
    }
    const player = G.players[ctx.currentPlayer]

    let connCost = Infinity

    // Check the cost to connect the new city to the current network. This cost remains at infinity if it 
    //  cannot be directly connected, and is 0 for the first city selected if there is no current network.
    if (player.cities.length > 0) {
        for (let i = 0; i < player.cities.length; i++) {
            if (city in edgeLookup[player.cities[i]]) {
                if (edgeLookup[player.cities[i]][city] < connCost) {
                    connCost = edgeLookup[player.cities[i]][city] 
                }
            }
        }
    } else if (Object.keys(G.selectedCities).length === 0) {
        connCost = 0
    }
    const nextAvailable = G.cityStatus[city].findIndex(i => i === null)
    if (nextAvailable >= G.step) {
        return INVALID_MOVE
    }
    const cost = houseCosts[nextAvailable]
    let totalConnCost
    try {
        // Construct a map of cities to be connected to the cost to connect them.
        let nodeMap = {}
        for (const selectedCity in G.selectedCities) {
            nodeMap[selectedCity] = G.selectedCities[selectedCity].connCost
        }
        nodeMap[city] = connCost
        totalConnCost = getMST(nodeMap)
    } catch {
        // The algorithm fails if the new city cannot be connected.
        return INVALID_MOVE
    }

    // Force the selected city to rerender
    G.rerender.cities = [city]
    G.rerender.activate = !G.rerender.activate

    G.connectionCost = totalConnCost
    G.selectedCities[city] = {cost: cost, connCost: connCost}
}

export function clearCities(G, ctx) {
    const toRerender = Object.keys(G.selectedCities)
    G.selectedCities = {}
    G.connectionCost = 0

    // Force the selected city to rerender
    G.rerender.cities = toRerender
    G.rerender.activate = !G.rerender.activate
}

export function buyCities(G, ctx) {
    let totalCost = G.connectionCost
    for (const city in G.selectedCities) {
        G.players[ctx.currentPlayer].cities.push(city)
        totalCost += G.selectedCities[city].cost
        const nextAvailable = G.cityStatus[city].findIndex(i => i === null)
        G.cityStatus[city][nextAvailable] = ctx.currentPlayer
    }
    const toRerender = Object.keys(G.selectedCities)
    G.logs.push({playerID: ctx.currentPlayer, move: 'buyCities', cities: toRerender, cost: totalCost})

    G.players[ctx.currentPlayer].money -= totalCost
    G.selectedCities = {}
    G.connectionCost = 0

    // Force the selected city to rerender
    G.rerender.cities = toRerender
    G.rerender.activate = !G.rerender.activate
    ctx.events.endTurn()
}

export function endCities(G, ctx) {
    // Remove too small powerplants from the game.
    while (G.powerplantMarket[0] <= Math.min(...Object.values(G.players).map(p => p.cities.length))) {
        G.logs.push({move: 'removePP', removed: G.powerplantMarket[0]})
        removeLowest(G, ctx)
    }

    // Enter Step 2 if any player has bought enough cities.
    if (Object.values(G.players).some(p => p.cities.length >= playerSettings[ctx.numPlayers].step2 && G.step === 1)) {
        G.logs.push({move: 'step', removed: G.powerplantMarket[0], step: 2})
        G.step = 2
        // Remove the lowest powerplant from the game.
        removeLowest(G, ctx)
    }

    // End the game if any player has enough cities.
    if (Object.values(G.players).some(p => p.cities.length >= playerSettings[ctx.numPlayers].end)) {
        // The game will end immediately following powering.
        G.logs.push({move: 'willEnd'})
        G.endGame = true
    }
}

function removeLowest(G, ctx) {
    // Remove the lowest powerplant from the game.
    G.powerplantMarket[0] = G.powerplantDeck.pop()
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
}