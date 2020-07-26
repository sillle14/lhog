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

    /**
     * Calculate the resource capacity for a player.
     * 
     * @param player Player model for which to calculate the capacity.
     */
    static getCapacity(player) {
        let capacity = {coal: 0, oil: 0, trash: 0, uranium: 0, coil: 0}
        for (let i = 0; i < player.powerplants.length; i++) {
            const powerplant = powerplants[player.powerplants[i]]
            capacity[powerplant.resource] += (powerplant.resourceCost * 2)
        }
        return capacity
    }

    /**
     * Calculate the extra capacity for a player, i.e. how many of each resource they can additionally store,
     *  taking into account their current resources.
     * 
     * @param player Player model for which to calculate the extra capacity.
     */
    static getExtraCapacity(player) {
        let capacity = PlayerModel.getCapacity(player)
        for (const r in player.resources) {
            capacity[r] -= player.resources[r]
        }
        return capacity
    }
}

export default PlayerModel