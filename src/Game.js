import { cities } from './static/cities'
import PlayerModel from './models/player'
import { setPlayerOrder } from './moves/playerOrder'
import * as auction from './moves/auction'


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
        playerOrder: [],
        reverseOrder: [],
        biddingOrder: [...Array(ctx.numPlayers).keys()],
        auction: {upForAuction: null, selected: null, currentBid: null},
        logs: [],
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
            onBegin: auction.startAuction,  
            // End when everyone has bought a PP
            endIf: G => Object.values(G.players).every(player => player.boughtPP),
            turn: {
                order: {first: G => parseInt(G.playerOrder[0])},
            },
            moves: {
                selectPowerplant: auction.selectPowerplant,
                startBidding: auction.startBidding,
                makeBid: auction.makeBid,
            }
        }
    },
    minPlayers: 3,
    maxPlayers: 6,
};