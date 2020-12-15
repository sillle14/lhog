# WattMatrix

My implementation of the board game [Powergrid](https://boardgamegeek.com/boardgame/2651/power-grid) using [boardgame.io](boardgame.io) and React. You can play Powergrid as well as some other games at https://lhog.herokuapp.com/.

## Gameplay

I've abstracted a number of components for a simpler UI, so it will be easiest to play if you are already familar with the physical game. There are three tabs, one for the map, one for the power
plant and resource markets, and one for assorted reference information (the income chart, other players' boards, etc). The is currently no undo feature, and clicking on a red button will end your turn, so be careful!

## Development

Run `npm install` to install the necessary packages. Run the server using `npm run dev-server` and the client using `npm run dev`. This will instantiate three game boards in a single window for easy testing.

Alternatively, you can run `npm run dev-lobby` (with the server running) to use the basic lobby provided by boardgame.io. 

## Deployment

This is currently setup for deployment to Heroku with the server and client running at a single port. Run `npm start` to deploy.

However, this deployment only has a simple lobby implementation and no persistence. Check out [Lewis' House of Games](https://github.com/sillle14/lhog) for a more robust lobby implementation meant to host many boardgame.io games.

## Publish

To publish the package to npm, run `npm run publish:npm` to compile files for publication, followed by `npm publish`.