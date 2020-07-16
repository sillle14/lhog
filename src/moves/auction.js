import { INVALID_MOVE } from 'boardgame.io/core'

export function startAuction(G, ctx) {
    G.auction = {
        upForAuction: null, 
        currentBid: null,
        selected: null
    }
    for (const playerID in G.players) {
        G.players[playerID].boughtPP = false
    }
    G.logs.push({move: 'startPhase', phase: 'Auction'})
    G.scrollTo = 'ppMarket'
}

export function selectPowerplant(G, ctx, powerplant) {
    // Only can select from current market
    if (G.powerplantMarket.indexOf(powerplant) > 3 && G.step < 3) {
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
    G.auction.currentBid = G.auction.upForAuction - 1

    // Everyone who hasn't bought a PP starts in the auction.
    for (const playerID in G.players) {
        G.players[playerID].inAuction = !G.players[playerID].boughtPP
    }
    G.logs.push({playerID: ctx.currentPlayer, move: 'startAuction', powerplant: G.auction.selected})
}

// Called after a bid or pass from within the auction. Sets the next player to bid if any remain, otherwise
//  sells the PP to the highest bidder, reseting the auction.
function afterBid(G, ctx) {
    // If there is only one player left in the auction, they win!
    const playersLeft = Object.keys(G.players).filter(playerID => G.players[playerID].inAuction)
    if (playersLeft.length === 1) {
        const winningID = playersLeft[0]
        G.logs.push({playerID: winningID, move: 'buyPP', powerplant: G.auction.upForAuction, cost: G.auction.currentBid})

        // Buy the powerplant.
        G.players[winningID].boughtPP = true
        G.players[winningID].powerplants.push(G.auction.upForAuction)
        G.players[winningID].money -= G.auction.currentBid

        // Remove the powerplant from the market, replace it, and resort it.
        G.powerplantMarket.splice(G.powerplantMarket.indexOf(G.auction.upForAuction), 1)
        G.powerplantMarket.push(G.powerplantDeck.pop())
        G.powerplantMarket.sort((a,b) => a-b)

        // Reset the auction. 
        G.auction.upForAuction = null
        G.auction.selected = null
        G.auction.currentBid = null

        afterBuy(G, ctx)
    } else {
        // Otherwise, just pass the bidding to the next player in a clockwise fashion.
        let nextPlayer
        let i = 1
        while (true) {
            nextPlayer = ctx.playOrder[(ctx.playOrderPos + i) % ctx.numPlayers]
            if (G.players[nextPlayer].inAuction) {
                break
            }
            i++
        }
        ctx.events.endTurn({next: nextPlayer})
    }
}

// After a player buys a PP or passes, set the turn to the next player, or end the phase.
function afterBuy(G, ctx) {
    // The next player to open bidding is the first player in order who has not bought a PP.
    let nextPlayer = -1
    for (let i = 0; i < G.playerOrder.length; i++) {
        if (!G.players[G.playerOrder[i]].boughtPP) {
            nextPlayer = G.playerOrder[i]
            break
        }
    }
    // If a next player was assigned, send the turn to that player.
    if (nextPlayer >= 0) {
        ctx.events.endTurn({next: nextPlayer})
    } else {
        G.firstTurn = false
        ctx.events.endPhase()
        ctx.events.endTurn()
    }
}

export function makeBid(G, ctx, bid) {
    if (bid <= G.auction.currentBid) {
        return INVALID_MOVE
    }
    G.auction.currentBid = bid
    G.logs.push({playerID: ctx.currentPlayer, move: 'bid', bid: bid})
    afterBid(G, ctx)
}

export function passBid(G, ctx) {
    G.players[ctx.currentPlayer].inAuction = false
    G.logs.push({playerID: ctx.currentPlayer, move: 'passAuction'})
    afterBid(G, ctx)
}

export function passBuyPP(G, ctx) {
    G.players[ctx.currentPlayer].boughtPP = true
    G.logs.push({playerID: ctx.currentPlayer, move: 'passBuy'})
    afterBuy(G, ctx)
}