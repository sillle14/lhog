import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
    _id: String,
    gameName: String,
    players: {},
    setupData: {},
    gameOver: {},
    nextRoomID: String,
    unlisted: Boolean,
    state: String,
    initialState: String,
    log: [{}],
    createdAt: Date,
    updatedAt: Date,
}, {timestamps: {}});

const Game = mongoose.model('Game', gameSchema)

export default Game