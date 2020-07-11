export function getPlayerOrder(players, firstTurn, shuffle) {
    let playerIDs = Object.keys(players)
    if (firstTurn) {
        playerIDs = shuffle(playerIDs)
    } else {
        // Sort on number of cities, then by max powerplant number.
        playerIDs.sort((id) => players[id].cities.length + (Math.max(...players[id].powerplants) / 100))
    }
    return playerIDs 
}

export function setPlayerOrder(G, ctx) {
    G.playerOrder = getPlayerOrder(G.players, G.firstTurn, ctx.random.Shuffle)
    G.reverseOrder = [...G.playerOrder]
    G.reverseOrder.reverse()
    ctx.events.endPhase()
}