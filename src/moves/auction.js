import { powerplants } from '../static/powerplants'

export function startAuction(G, ctx) {
    G.auction = {
        activePlayers: [...Array(ctx.numPlayers).keys()], upForAuction: null, currentBid: null
    }
}

export function selectPowerplant(G, ctx, powerplant) {
    G.auction.upForAuction = powerplant
    G.auction.currentBid = powerplants[powerplant].cost
}