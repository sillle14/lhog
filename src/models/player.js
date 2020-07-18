import { powerplants } from '../static/powerplants'

class PlayerModel {
    constructor () {
        this.cities = ['Boston', 'New York']
        this.resources = {coal: 3, oil: 2, trash: 0, uranium: 0}
        this.powerplants = [3,4,5]
        this.money = 50
        this.boughtPP = false  // Keep track of whether this player has bought a PP (or passed) this round
        this.inAuction = false
        this.bureaucracy = {
            toPower: [],
            hasPowered: false,
            poweredCount: 0,
        }
    }

    static getCapacity(player) {
        let capacity = {coal: 0, oil: 0, trash: 0, uranium: 0, coil: 0}
        for (let i = 0; i < player.powerplants.length; i++) {
            const powerplant = powerplants[player.powerplants[i]]
            capacity[powerplant.resource] += (powerplant.resourceCost * 2)
        }
        return capacity
    }
}

export default PlayerModel