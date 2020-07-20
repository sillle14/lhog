import { ActivePlayers } from 'boardgame.io/core';

import { cities } from './static/cities'
import { powerplants, STEP_3 } from './static/powerplants'
import { playerSettings } from './static/reference'

import PlayerModel from './models/player'

import { getPlayerOrder, pass } from './moves/common'
import * as auction from './moves/auction'
import * as cityMoves from './moves/cities'
import * as resourceMoves from './moves/resources'
import * as bureaucracy from './moves/bureaucracy'
import * as region from './moves/regions'


function setup(ctx, setupData) {
    let cityStatus = {}
    for (const city in cities) {
        cityStatus[city] = [null, null, null]
    }
    let players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = new PlayerModel()
    }
    let coalMarket = []
    let oilMarket = []
    let trashMarket = []
    let uraniumMarket = []

    for (let i = 0; i < 24; i++) {
        coalMarket.push({cost: Math.floor(i/3) + 1, available: true})
        oilMarket.push({cost: Math.floor(i/3) + 1, available: i > 5})
        trashMarket.push({cost: Math.floor(i/3) + 1, available: i > 14})
        if (i < 8) {
            uraniumMarket.push({cost: i + 1, available: false})
        }
    }

    for (let i = 10; i < 18; i += 2) {
        uraniumMarket.push({cost: i, available: i > 12})
    }

    let powerplantMarket = [3, 4, 5, 6, 7, 8, 9, 10]
    let powerplantDeck = []
    // Add all other powerplants to the deck, except for 13.
    for (const pp in powerplants) {
        if (pp > 10 && pp !== 13) {
            powerplantDeck.push(pp)
        }
    }
    // Shuffle the deck and randomly remove powerplants according to the number of players.
    powerplantDeck = ctx.random.Shuffle(powerplantDeck)
    powerplantDeck.splice(0, playerSettings[ctx.numPlayers].remove)

    // Add 13 to the top of the deck, and the step 3 card to the back. Note that we draw off the end of the array.
    powerplantDeck.push(13)
    powerplantDeck.unshift(STEP_3)

    const playerOrder = getPlayerOrder(players, ctx.random.Shuffle)

    return {
        cityStatus: cityStatus, 
        powerplantMarket: powerplantMarket, 
        powerplantDeck: powerplantDeck,
        powerplantsStep3: [40, 42, 44, 46, 50],
        players: players,
        resourceMarket: {
            coal: coalMarket,
            oil: oilMarket,
            trash: trashMarket,
            uranium: uraniumMarket,
        },
        step: 1,
        firstTurn: true,
        playerOrder: playerOrder,
        logs: [{move: 'playerOrder', order: playerOrder, initial: true}],
        regions: [],

        auction: {upForAuction: null, selected: null, currentBid: null},

        selectedCities: {},
        connectionCost: 0,

        selectedResources: {coal: 0, oil: 0, trash: 0, uranium: 0},
        resourceCost: 0,

        // In order to efficiently rerender nodes on demand, nodes for each city listed will be rerendered when
        //  the activate bit flips. This allows for rerendering the same cities repeatedly if required.
        rerender: {
            activate: true,
            cities: []
        },
        scrollTo: null
    }
}

// Turn order constant to have each player make one move in reverse player order.
const REVERSE_ONCE = {
    order: {
        first: (G, ctx) => ctx.playOrder.length - 1,
        next: (G, ctx) => {if (ctx.playOrderPos > 0) { return ctx.playOrderPos - 1}},
        playOrder: (G, ctx) => G.playerOrder
    }
}

export const REGIONS = 'regions'
export const AUCTION = 'auction'
export const CITY = 'city'
export const RESOURCE = 'resource'
export const BUREAUCRACY = 'bureaucracy'

// TODO:
// * Test, test test!!!!

// TODO LONG TERM:
// * Rewrite lobby -- this enables the below
// * Save game -- use a free mongo add in to heroku, save all necessary in JSON, and add to setupData when loading a game.


export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    phases: {
        [REGIONS]: {
            onBegin: (G, ctx) => {G.scrollTo = 'map'},
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
            onBegin: (G, ctx) => {G.logs.push({move: 'startPhase', phase: 'Buy Resources'}); G.scrollTo = 'resourceMarket'},
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
            onBegin: (G, ctx) => {G.logs.push({move: 'startPhase', phase: 'Buy Cities'}); G.scrollTo = 'map'},
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
                    coil: {
                        moves: {spendCoil: bureaucracy.spendCoil}
                    }
                }
            },
            onEnd: bureaucracy.endBureaucracy,
            next: AUCTION,

        }
    },
    minPlayers: 3,
    maxPlayers: 6,
};