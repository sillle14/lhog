import { powerplants } from '../static/powerplants'

class PlayerModel {
    constructor (name) {
        this.name = name
        this.cities = []
        this.resources = {coal: 0, oil: 0, trash: 0, uranium: 0}
        this.powerplants = [6, 13, 11]
        this.money = 50
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