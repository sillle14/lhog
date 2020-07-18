import { INVALID_MOVE } from 'boardgame.io/core'
import { STEP_3 } from '../static/powerplants'
import { getPlayerOrder } from './playerOrder'

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
    // Only can select from current market (in step 3, all are current)
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

        // If the step 3 card was drawn, shuffle the new PP deck. Note that it will always be the most expensive PP.
        if (G.powerplantMarket[7] === STEP_3) {
            G.powerplantDeck = ctx.random.Shuffle(G.powerplantsStep3)
            G.startStep3 = true
        }

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
        ctx.events.endPhase()
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

export function afterAuction(G, ctx) {
    // Re-calculate player order if it is the first turn.
    if (G.firstTurn) {
        G.firstTurn = false
        G.playerOrder = getPlayerOrder(G.players)
        G.logs.push({move: 'playerOrder', order: G.playerOrder})
    }
    // If step 3 is starting, remove the appropriate powerplants and start the step.
    if (G.startStep3 && G.step !== 3) {
        G.logs.push({move: 'step3', removed: G.powerplantMarket[0]})
        // Remove the most expensive and least expensive powerplants. Note that the most expensive will always
        //  be the step 3 card.
        G.powerplantMarket = G.powerplantMarket.slice(1, 7)
        G.step = 3
    }
}