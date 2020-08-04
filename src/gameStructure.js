import { ActivePlayers } from 'boardgame.io/core';

import { pass } from './moves/common'
import * as auction from './moves/auction'
import * as cityMoves from './moves/cities'
import * as resourceMoves from './moves/resources'
import * as bureaucracy from './moves/bureaucracy'
import * as region from './moves/regions'

// Turn order constant to have each player make one move in reverse player order.
const REVERSE_ONCE = {
    order: {
        first: (G, ctx) => ctx.playOrder.length - 1,
        next: (G, ctx) => {if (ctx.playOrderPos > 0) { return ctx.playOrderPos - 1}},
        playOrder: (G, ctx) => G.playerOrder
    }
}

// Game tabs:
export const MAP = 'Map'
export const MARKETS = 'Markets'
export const REFERENCE = 'Reference'

// Phases:
export const REGIONS = 'regions'
export const AUCTION = 'auction'
export const CITY = 'city'
export const RESOURCE = 'resource'
export const BUREAUCRACY = 'bureaucracy'

// Stages:
export const COIL_STAGE = 'coil'
export const DISCARD_PP = 'discardPP'
export const DISCARD_RESOURCES = 'discardResources'

export const gamePhases = {
    [REGIONS]: {
        onBegin: (G, ctx) => {G.tab = MAP},
        start: true,
        moves: {
            selectRegion: region.selectRegion,
            clearRegions: region.clear,
            confirmRegions: region.confirm,
        },
        next: AUCTION
    },
    [AUCTION]: {
        onBegin: auction.startAuction,  
        turn: {
            order: {first: G => parseInt(G.playerOrder[0])},
            stages: {
                [DISCARD_PP]: {
                    moves: {
                        selectToDiscard: auction.selectToDiscard,
                        discardPP: auction.discardPP,
                    },
                },
                [DISCARD_RESOURCES]: {
                    moves: {
                        discardResources: auction.discardResources
                    }
                }
            }
        },
        moves: {
            selectPowerplant: auction.selectPowerplant,
            startBidding: auction.startBidding,
            makeBid: auction.makeBid,
            passBid: auction.passBid,
            passBuyPP: auction.passBuyPP,
        },
        onEnd: auction.afterAuction,
        next: RESOURCE,
    },
    [RESOURCE]: {
        onBegin: (G, ctx) => {G.logs.push({move: 'startPhase', phase: 'Buy Resources'}); G.tab = MARKETS},
        moves: {
            selectResource: resourceMoves.selectResource,
            clearResources: resourceMoves.clearResources,
            buyResources: resourceMoves.buyResources,
            pass: pass
        },
        turn: REVERSE_ONCE,
        next: CITY
    },
    [CITY]: {
        onBegin: (G, ctx) => {G.logs.push({move: 'startPhase', phase: 'Buy Cities'}); G.tab = MAP},
        moves: {
            selectCity: cityMoves.selectCity,
            clearCities: cityMoves.clearCities,
            buyCities: cityMoves.buyCities,
            pass: pass
        },
        turn: REVERSE_ONCE,
        onEnd: cityMoves.endCities,
        next: BUREAUCRACY,
    },
    [BUREAUCRACY]: {
        onBegin: bureaucracy.startBureaucracy,
        endIf: G => Object.values(G.players).every(p => p.bureaucracy.hasPowered),
        moves: {
            selectToPower: bureaucracy.selectToPower,
            passPowering: bureaucracy.passPowering,
            clearToPower: bureaucracy.clearToPower,
            power: bureaucracy.power
        },
        turn: {
            activePlayers: ActivePlayers.ALL,
            stages: {
                [COIL_STAGE]: {
                    moves: {spendCoil: bureaucracy.spendCoil}
                }
            }
        },
        onEnd: bureaucracy.endBureaucracy,
        next: AUCTION,
    }
}