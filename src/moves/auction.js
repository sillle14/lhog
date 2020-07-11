import { powerplants } from '../static/powerplants'
import { INVALID_MOVE } from 'boardgame.io/core'

export function startAuction(G, ctx) {
    G.auction = {
        upForAuction: null, 
        currentBid: null,
        selected: null,
        playOrderPos: 0
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

function nextInAuction(ctx, players) {
    //TODO Put in logic to buy powerplants in this function
    // To decide who bids next, fall back to the default player order.
    let nextPlayer
    let i = 1
    while (true) {
        nextPlayer = ctx.playOrder[(ctx.playOrderPos + i) % ctx.numPlayers]
        if (players[nextPlayer].inAuction) {
            break
        }
        i++
    }
    return nextPlayer
}

export function makeBid(G, ctx, bid) {
    if (bid <= G.auction.currentBid) {
        return INVALID_MOVE
    }
    G.auction.currentBid = bid
    G.logs.push({playerID: ctx.currentPlayer, move: 'bid', bid: bid})
    ctx.events.endTurn({next: nextInAuction(ctx, G.players)})
}

export function passAuction(G, ctx) {
    G.players[ctx.currentPlayer].inAuction = false

    // If there is only one player left in the auction, they win!
    const playersLeft = Object.keys(G.players).filter(playerID => G.players[playerID].inAuction)
    if (playersLeft.length === 1) {
        const winningID = playersLeft[0]
        G.logs.push({playerID: winningID, move: 'buyPP', powerplant: G.auction.upForAuction, cost: G.auction.currentBid})

        // Buy the powerplant.
        G.players[winningID].boughtPP = true
        G.players[winningID].powerplants.push(G.auction.upForAuction)
        G.players[winningID].money -= G.auction.currentBid

        // Reset the auction. 
        G.auction.upForAuction = null
        G.auction.selected = null
        G.auction.currentBid = null

        // Give the turn the the correct player based on turn order.
        // TODO: check for no one left?
        let nextPlayer
        let i = 1
        while (true) {
            nextPlayer = G.playerOrder[(G.auction.playOrderPos + i) % ctx.numPlayers]
            if (!G.players[nextPlayer].boughtPP) {
                break
            }
            i++
        }
        G.auction.playOrderPos = (G.auction.playOrderPos + 1) % ctx.numPlayers
        ctx.events.endTurn({next: nextPlayer})
    } else {
        G.logs.push({playerID: ctx.currentPlayer, move: 'passAuction'})
        ctx.events.endTurn({next: nextInAuction(ctx, G.players)})
    }
}