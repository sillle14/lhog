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
    for (let i = 0; i < 4; i++) {
        players[i] = new PlayerModel('Player ' + i)
    }
    return {cityStatus: cityStatus, powerplants: [3, 4, 5, 6, 7, 8, 13, 11], players: players}
}

export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    moves: {
        takeGems: (G, ctx) => {},
    }
};