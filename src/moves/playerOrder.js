export function getPlayerOrder(players, firstTurn, shuffler) {
    let playerIDs = Object.keys(players)
    if (firstTurn) {
        playerIDs = shuffler(playerIDs)
    } else {
        // Sort on number of cities, then by max powerplant number.
        playerIDs.sort((id) => players[id].cities.length + (Math.max(...players[id].powerplants) / 100))
    }
    return playerIDs 
}

export function setPlayerOrder(G, ctx) {
    G.playerOrder = getPlayerOrder(G.players, G.firstTurn, ctx.random.Shuffle)
    // TODO: Maybe just store once?
    G.reverseOrder = [...G.playerOrder]
    G.reverseOrder.reverse()
    G.logs.push({move: 'playerOrder', order: G.playerOrder})
    ctx.events.endPhase()
}