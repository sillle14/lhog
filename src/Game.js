import { cities } from './static/cities'
import PlayerModel from './models/player'


// TODO:
// * Map in scrollable div
// * Test city names above edges


function setup(ctx, setupData) {
    let cityStatus = {}
    for (let i = 0; i < cities.length; i ++) {
        cityStatus[cities[i].id] = {house10: null, house15: null, house20: null}
    }
    let players = {}
    for (let i = 0; i < 6; i++) {
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
        powerplants: [3, 4, 5, 6, 7, 8, 13, 11], 
        players: players,
        coalMarket: coalMarket,
        oilMarket: oilMarket,
        trashMarket: trashMarket,
        uraniumMarket: uraniumMarket
    }
}

export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    moves: {
        takeGems: (G, ctx) => {},
    }
};