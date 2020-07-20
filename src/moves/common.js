export function getPlayerOrder(players, shuffler) {
    let playerIDs = Object.keys(players)
    if (shuffler) {
        playerIDs = shuffler(playerIDs)
    } else {
        // Sort on number of cities, then by max powerplant number.
        playerIDs.sort((id1, id2) => playerSortScore(players[id2]) - playerSortScore(players[id1]))
    }
    return playerIDs 
}

/*
Function to score a player on first city count, and then highest PP.
*/
function playerSortScore(player) {
    return player.cities.length + (Math.max(...player.powerplants) / 100)
}

/**
 * Generic pass move.
 */
export function pass(G, ctx) {
    G.logs.push({playerID: ctx.currentPlayer, move: 'pass'})
    ctx.events.endTurn()
}