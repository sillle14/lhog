export const payment = {
    0: 10, 1: 22, 2: 33, 3: 44, 4: 54, 5: 64, 6: 73, 7: 82, 8: 90, 9: 98, 10: 105, 11: 112, 12: 118, 13: 124,
    14: 129, 15: 134, 16: 138, 17: 142, 18: 145, 19: 148, 20: 150
}


export const playerSettings = {
    3: {
        regions: 3, 
        remove: 8, 
        step2: 7, 
        end: 17, 
        refill: {
            1: {coal: 4, oil: 2, trash: 1, uranium: 1},
            2: {coal: 5, oil: 3, trash: 2, uranium: 1},
            3: {coal: 3, oil: 4, trash: 3, uranium: 1},
        }
    },
    4: {
        regions: 4, 
        remove: 4, 
        step2: 7, 
        end: 17, 
        refill: {
            1: {coal: 5, oil: 3, trash: 2, uranium: 1},
            2: {coal: 6, oil: 4, trash: 3, uranium: 2},
            3: {coal: 4, oil: 5, trash: 4, uranium: 2},
        }
    },
    5: {
        regions: 5, 
        remove: 0, 
        step2: 7, 
        end: 15, 
        refill: {
            1: {coal: 5, oil: 4, trash: 3, uranium: 2},
            2: {coal: 7, oil: 5, trash: 3, uranium: 3},
            3: {coal: 5, oil: 6, trash: 5, uranium: 2},
        }
    },
    6: {
        regions: 5, 
        remove: 0, 
        step2: 6, 
        end: 14, 
        refill: {
            1: {coal: 7, oil: 5, trash: 3, uranium: 2},
            2: {coal: 9, oil: 6, trash: 5, uranium: 3},
            3: {coal: 6, oil: 7, trash: 6, uranium: 3},
        }
    }
}