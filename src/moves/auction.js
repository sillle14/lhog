import { INVALID_MOVE } from 'boardgame.io/core'
import { STEP_3 } from '../static/powerplants'
import { getPlayerOrder } from './common'

import PlayerModel from '../models/player'

import { MARKETS } from '../Game'

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
    G.tab = MARKETS
}

export function selectPowerplant(G, ctx, powerplant) {
    if (G.auction.selected === powerplant) {
        G.auction.selected = null
        return
    }

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
        G.players[winningID].money -= G.auction.currentBid
        if (G.players[winningID].powerplants.length > 2) {
            // Move the winner into the discard stage.
            ctx.events.setActivePlayers({ value: {[winningID]: 'discardPP'}})
        } else {
            // Buy the PP.
            G.players[winningID].powerplants.push(G.auction.upForAuction)
            afterBuy(G, ctx)
        }
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
    // Remove the powerplant from the market, replace it, and resort it.
    G.powerplantMarket.splice(G.powerplantMarket.indexOf(G.auction.upForAuction), 1)
    const nextPlant = G.powerplantDeck.pop()
    if (nextPlant) {
        G.powerplantMarket.push(nextPlant)
    }
    G.powerplantMarket.sort((a,b) => a-b)

    // If the step 3 card was drawn, shuffle the new PP deck.
    if (nextPlant === STEP_3 && !G.startStep3) {
        G.powerplantDeck = ctx.random.Shuffle(G.powerplantsStep3)
        G.startStep3 = true
    }

    // Reset the auction. 
    G.auction.selected = null
    G.auction.currentBid = null
    G.auction.upForAuction = null

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
    G.logs.push({playerID: ctx.currentPlayer, move: 'pass'})
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
        G.logs.push({move: 'step', removed: G.powerplantMarket[0], step: 3})
        // Remove the most expensive and least expensive powerplants. Note that the most expensive will always
        //  be the step 3 card.
        G.powerplantMarket = G.powerplantMarket.slice(1, 7)
        G.step = 3
    }
}

/*********************
 *   DISCARD MOVES   *
 *********************/

export function selectToDiscard(G, ctx, powerplant) {
    if (G.auction.toDiscard === powerplant) {
        G.auction.toDiscard = null
    } else {
        G.auction.toDiscard = powerplant
    }
}

export function discardPP(G, ctx) {
    // Buy the PP, replacing the PP to discard with the new one.
    const activePlayer = Object.keys(ctx.activePlayers)[0]
    G.players[activePlayer].powerplants[G.players[activePlayer].powerplants.indexOf(G.auction.toDiscard)] = G.auction.upForAuction
    G.logs.push({playerID: activePlayer, move: 'discard', powerplant: G.auction.toDiscard})
    G.auction.toDiscard = null

    // Since changes to G aren't propagated until the end of the move, here is a hacky fix to get capacity.
    const capacity = PlayerModel.getCapacity({powerplants: [...G.players[activePlayer].powerplants]})

    // Automatically discard uranium and trash which exceeds capacity.
    for (const r in {uranium: null, trash: null}) {
        if (G.players[activePlayer].resources[r] > capacity[r]) {
            G.logs.push({playerID: activePlayer, move: 'discard', resource: r, count: G.players[activePlayer].resources[r] - capacity[r]})
            G.players[activePlayer].resources[r] = capacity[r]
        }
    }
    // If there is no coil capacity, then just discard excess coal and oil as well.
    if (capacity.coil === 0) {
        for (const r in {coal: null, oil: null}) {
            if (G.players[activePlayer].resources[r] > capacity[r]) {
                G.logs.push({playerID: activePlayer, move: 'discard', resource: r, count: G.players[activePlayer].resources[r] - capacity[r]})
                G.players[activePlayer].resources[r] = capacity[r]
            }
        }
    } else {
        // Calculate the overflow.
        const extraCoal = Math.max(G.players[activePlayer].resources.coal - capacity.coal, 0)
        const extraOil = Math.max(G.players[activePlayer].resources.oil - capacity.oil, 0)

        // If there isn't enough coil capacity, handle discards.
        if (extraCoal + extraOil > capacity.coil) {
            if (extraOil === 0) {
                // Just discard the extra coal.
                G.logs.push({playerID: activePlayer, move: 'discard', resource: 'coal', count: extraCoal - capacity.coil})
                G.players[activePlayer].resources.coal -= extraCoal - capacity.coil
            } else if (extraCoal === 0) {
                // Just discard the extra oil.
                G.logs.push({playerID: activePlayer, move: 'discard', resource: 'oil', count: extraOil - capacity.coil})
                G.players[activePlayer].resources.oil -= extraOil - capacity.coil
            } else {
                G.extraCoal = extraCoal
                G.extraOil = extraOil
                ctx.events.setActivePlayers({ value: {[activePlayer]: 'discardResources'}})
                return
            }
        }
    }

    ctx.events.endStage()
    afterBuy(G, ctx)
}

export function discardResources(G, ctx, coal, oil) {
    const activePlayer = Object.keys(ctx.activePlayers)[0]
    if (coal > 0) {
        G.logs.push({playerID: activePlayer, move: 'discard', resource: 'coal', count: coal})
        G.players[activePlayer].resources.coal -= coal
    }
    if (oil > 0) {
        G.logs.push({playerID: activePlayer, move: 'discard', resource: 'oil', count: oil})
        G.players[activePlayer].resources.oil -= oil
    }
    ctx.events.endStage()
    afterBuy(G, ctx)
}