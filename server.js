import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { WattMatrix } from './src/Game';

const PORT = process.env.PORT || 8000;
const server = Server({ games: [WattMatrix] })

const SINGLE_PORT = process.env.SINGLE_PORT

if (SINGLE_PORT) {
    // Build path relative to the server.js file
    const frontEndAppBuildPath = path.resolve(__dirname, './build');
    server.app.use(serve(frontEndAppBuildPath))

    server.run(PORT, () => {
        server.app.use(
            async (ctx, next) => await serve(frontEndAppBuildPath)(
                Object.assign(ctx, { path: 'index.html' }),
                next
            )
        )
    });
} else {
    server.run(PORT)
}


