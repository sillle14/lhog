import { cities } from './static/cities'
import PlayerModel from './models/player'
import { setPlayerOrder } from './moves/playerOrder'
import { startAuction, selectPowerplant } from './moves/auction'
import { TurnOrder } from 'boardgame.io/core';


function setup(ctx, setupData) {
    let cityStatus = {}
    for (let i = 0; i < cities.length; i ++) {
        cityStatus[cities[i].id] = {house10: null, house15: null, house20: null}
    }
    let players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = new PlayerModel('Player ' + i)
    }
    let coalMarket = []
    let oilMarket = []
    let trashMarket = []
    let uraniumMarket = []

    for (let i = 0; i < 24; i++) {
        coalMarket.push({position: i, cost: Math.floor(i/3) + 1, available: true})
        oilMarket.push({position: i, cost: Math.floor(i/3) + 1, available: i > 5})
        trashMarket.push({position: i, cost: Math.floor(i/3) + 1, available: i > 14})
        if (i < 8) {
            uraniumMarket.push({position: i, cost: i + 1, available: false})
        }
    }

    for (let i = 10; i < 18; i += 2) {
        uraniumMarket.push({position: 2*i - 8, cost: i, available: i > 12})
    }

    return {
        cityStatus: cityStatus, 
        powerplantMarket: [3, 4, 5, 6, 7, 8, 13, 11], 
        players: players,
        coalMarket: coalMarket,
        oilMarket: oilMarket,
        trashMarket: trashMarket,
        uraniumMarket: uraniumMarket,
        step: 1,
        firstTurn: true,
        // Non-empty active players so phase doesn't end immediately
        auction: {activePlayers: [null], upForAuction: null, currentBid: null}, 
        playerOrder: [],
        reverseOrder: []
    }
}

export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    phases: {
        playerOrder: {
            onBegin: setPlayerOrder,
            next: 'auction',
            start: true,  // TODO: The real game needs to start with region selection
        },
        auction: {
            onBegin: startAuction,  
            endIf: G => (G.auction.activePlayers.length === 0),
            turn: {
                order: TurnOrder.CUSTOM_FROM('playerOrder')
            },
            moves: {
                selectPowerplant: selectPowerplant
            }
        }
    },
    minPlayers: 3,
    maxPlayers: 6,
};