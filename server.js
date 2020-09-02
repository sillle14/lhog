import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { WattMatrix } from './src/Game';

const PORT = process.env.PORT || 8000;
const server = Server({ games: [WattMatrix] })

const SINGLE_PORT = process.env.SINGLE_PORT

server.router.get('/ping', async ctx => {
    console.log('pong')
    ctx.body = 'pong'
    return ctx
});

// TODO: Add passport and a login endpoint.
// Just get server set up with passport, see if the lobby can be authenticated
// TODO: add login
// TODO: Add to the router so that lobby requests first need to autheticate

if (SINGLE_PORT) {
    // Build path relative to the server.js file
    const frontEndAppBuildPath = path.resolve(__dirname, './build');
    server.app.use(serve(frontEndAppBuildPath))

    // TODO: I don't think this is necessary, but try on heroku
    // server.run(PORT, () => {
    //     server.app.use(
    //         async (ctx, next) => await serve(frontEndAppBuildPath)(
    //             Object.assign(ctx, { path: 'index.html' }),
    //             next
    //         )
    //     )
    // });
    server.run(PORT)
} else {
    server.run(PORT)
}


