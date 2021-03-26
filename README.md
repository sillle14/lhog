# Lewis' House of Games (LHoG)

A lobby implementation for games created using [boardgame.io](boardgame.io). This includes basic sign-in, persistent game storage (MongoDB), and a simple leaderboard. Any game written using boardgame.io can in theory be deployed here, although there are a few restrictions noted below.

## Games

- [Gembalaya](https://github.com/sillle14/gembalaya) (Splendor)
- [WattMatrix](https://github.com/sillle14/wattmatrix) (Powergrid)
- [CubeNations](https://github.com/sillle14/cubenations) (Tigris & Euphrates)
- Thurn & Taxis and Inis are planned/in development

## Publishing Your Game to LHoG

As mentioned above, theoretically any game created with boardgame.io will fit into this lobby framework. I haven't tested any games other than my own, so there may be some bugs! If you are interested, publish your game to NPM and make a PR which adds your game to server.js and index.js.

In order to collect game statistics, there is one additional requirement. All games must report winning player IDs as `{winnerIds: [1, ...]}` on the `endGame` call, specified [here](https://boardgame.io/documentation/#/events?id=endgame). This allows the database layer to parse and save players who won the game.

## Development

Run `npm install` to install the necessary packages. Run the server using `npm run dev-server` and the client using `npm run dev`.

## Deployment

This is currently setup for deployment to Heroku with the server and client running at a single port. Run `npm start` to deploy.