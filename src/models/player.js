import { powerplants } from '../static/powerplants'

class PlayerModel {
    constructor () {
        this.cities = []
        this.resources = {coal: 0, oil: 0, trash: 0, uranium: 0}
        this.powerplants = []
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
        for (const r in player.resources) {
            capacity[r] -= player.resources[r]
        }
        return capacity
    }
}

export default PlayerModel