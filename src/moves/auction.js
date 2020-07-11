import { powerplants } from '../static/powerplants'
import { INVALID_MOVE } from 'boardgame.io/core'

export function startAuction(G, ctx) {
    G.auction = {
        upForAuction: null, 
        currentBid: null,
        selected: null,
    }
    for (const playerID in G.players) {
        G.players[playerID].boughtPP = false
    }
}

export function selectPowerplant(G, ctx, powerplant) {
    // Only can select from current market
    if (G.powerplantMarket.findIndex(p => p === powerplant) > 3 && G.step < 3) {
        return INVALID_MOVE
    }
    // Only when bidding is not in progress
    if (G.auction.upForAuction) {
        return INVALID_MOVE
    }
    G.auction.selected = powerplant
}

export function startBidding(G, ctx) {
    if (!G.auction.selected) {
        return INVALID_MOVE
    }
    G.auction.upForAuction = G.auction.selected
    G.auction.currentBid = G.auction.upForAuction

    // Everyone who hasn't bought a PP starts in the auction.
    for (const playerID in G.players) {
        if (!G.players[playerID].boughtPP) {
            G.players[playerID].inAuction = true
        }
    }
    G.logs.push({playerID: ctx.currentPlayer, move: 'startAuction', powerplant: G.auction.selected})
}

export function makeBid(G, ctx, bid) {
    if (bid <= G.auction.currentBid) {
        return INVALID_MOVE
    }
    G.auction.currentBid = bid
    // To decide who bids next, fall back to the default player order.
    let nextPlayer
    while (true) {
        nextPlayer = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.numPlayers]
        if (G.players[nextPlayer].inAuction) {
            break
        }
    }
    G.logs.push({playerID: ctx.currentPlayer, move: 'bid', bid: bid})
    ctx.events.endTurn({next: nextPlayer})
}