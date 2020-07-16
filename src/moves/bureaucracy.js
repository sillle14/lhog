import { payment } from '../static/reference'
import { INVALID_MOVE } from 'boardgame.io/core'

export function startBureaucracy(G, ctx) {
    G.logs.push({move: 'startPhase', phase: 'Bureaucracy'})
    G.scrollTo = 'reference'
    for (const playerID in G.players) {
        G.players[playerID].hasPowered = false
    }
}

export function selectToPower(G, ctx, powerplant) {
    if (G.players[ctx.playerID].hasPowered === true) {
        return INVALID_MOVE
    }
    if (G.players[ctx.playerID].ppToPower.includes(powerplant)) {
        G.players[ctx.playerID].ppToPower.splice(G.players[ctx.playerID].ppToPower.indexOf(powerplant), 1)
        return
    }
    // TODO: Check resources
    // TODO: This should set (on the player) total cities powered.
    G.players[ctx.playerID].ppToPower.push(powerplant)
}

export function clearToPower(G, ctx) {
    G.players[ctx.playerID].ppToPower = []
}

export function passPowering(G, ctx) {
    G.players[ctx.playerID].money += payment[0]
    G.players[ctx.playerID].lastIncome = payment[0] // TODO store count instead, use reference to calculate.
    G.players[ctx.playerID].ppToPower = []
    G.players[ctx.playerID].hasPowered = true
}
