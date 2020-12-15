import { Async } from 'boardgame.io/internal'
import mongoose from 'mongoose'

import Game from './game'
import User from './user'

export class MongoStore extends Async {

    constructor(uri) {
        super()
        this.uri = uri
    }

    /**
     * Connect.
     */
    async connect() {
        mongoose.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
    }   

    /**
     * Create a new game.
     *
     * This might just need to call setState and setMetadata in
     * most implementations.
     *
     * However, it exists as a separate call so that the
     * implementation can provision things differently when
     * a game is created.  For example, it might stow away the
     * initial game state in a separate field for easier retrieval.
     */
    async createGame(
        matchID,
        {
            initialState,
            metadata: {
                gameName,
                players,
                setupData,
                gameover,
                nextRoomID,
                unlisted,
                createdAt,
                updatedAt
            }
        }
    ) {
        // JSONify the state, in order to handle issues with field names containing '.'.
        const game = new Game({
            _id: matchID,
            gameName,
            unlisted,
            players,
            setupData,
            gameover,
            nextRoomID,
            unlisted,
            initialState: JSON.stringify(initialState),
            state: JSON.stringify(initialState),
            log: [],
            createdAt,
            updatedAt
        })
        await game.save()
    }

    /**
     * Update the game state.
     *
     * If passed a deltalog array, setState should append its contents to the
     * existing log for this game.
     */
    async setState(
        matchID,
        state,
        deltalog
    ) {
        // Check if the given state is newer than the saved state.
        const game = await Game.findById(matchID)
        const previousState = game && JSON.parse(game.state)
        if (!previousState || previousState._stateID < state._stateID) {
            // If the game is ending, log player stats. 
            // Note that this depends on reporting winning player IDs as {winnerIds: [1, ...]} on the endGame call as specified here:
            //  https://boardgame.io/documentation/#/events?id=endgame
            if (state.ctx.gameover) {
                for (const playerID in game.players) {
                    // Increment matches for all players.
                    let increment = {$inc: {[`stats.${game.gameName}.matches`]: 1}}
                    // Increment wins for all winners. state.ctx.gameover stores the playerIDs of all winners.
                    if (state.ctx.gameover.winnerIDs.includes(playerID)) {
                        increment.$inc[`stats.${game.gameName}.wins`] = 1
                    }
                    await User.findOneAndUpdate({username: game.players[playerID].name}, increment)
                }
            }
            await Game.findByIdAndUpdate(
                matchID,
                {
                    state: JSON.stringify(state),
                    log: [...((game && game.log) || []), ...(deltalog || [])]
                },
                {upsert: true}
            )
        }
    }

    /**
     * Update the game metadata.
     */
    async setMetadata(
        matchID,
        {
            gameName,
            players,
            setupData,
            gameover,
            nextRoomID,
            unlisted,
            createdAt,
            updatedAt,
        }
    ) {
        await Game.findByIdAndUpdate(
            matchID,
            {
                gameName,
                players,
                setupData,
                gameover,
                nextRoomID,
                unlisted,
                createdAt,
                updatedAt,
            },
            {upsert: true}
        )
    }

    /**
     * Fetch the game state.
     */
    async fetch (
        matchID,
        { state, log, metadata, initialState }
    ) {
        let result = {}
        const game = await Game.findById(matchID)
        if (!game) {
            return result
        }

        if (metadata) {
            result.metadata = {
                gameName: game.gameName,
                players: game.players || [],
                setupData: game.setupData,
                gameover: game.gameover,
                nextRoomID: game.nextRoomID,
                unlisted: game.unlisted,
                createdAt: game.createdAt,
                updatedAt: game.updatedAt,
            }
        }
        if (initialState) {
            result.initialState = JSON.parse(game.initialState)
        }
        if (state) {
            result.state = JSON.parse(game.state)
        }
        if (log) {
            result.log = game.log
        }
      
        return result
    }

    /**
     * Remove the game state.
     */
    async wipe(matchID) {
        await Game.findByIdAndDelete(matchID)
    }

    /**
     * Return all games.
     */
    async listGames({
        gameName,
        where: {
            isGameover,
            updatedBefore,
            updatedAfter
        }
    }) {
        const filter = {}
        if (gameName) {
            filter.gameName = gameName
        }
        if (isGameover !== undefined) {
            filter.gameOver = isGameover
        }
        if (updatedBefore) {
            filter.updatedAt = {$lt: updatedBefore}
        } else if (updatedAfter) {
            filter.updatedAt = {$gt: updatedBefore}
        }
        
        const games = await Game.find(filter, {_id: 1})
        return games.map((game) => game._id)
    }
}