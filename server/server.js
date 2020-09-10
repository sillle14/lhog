import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import session from 'koa-session'
import passport from 'koa-passport'
import MongooseStore from 'koa-session-mongoose'
import { WattMatrix } from '../src/Game';

import { addRoutes } from './routes'
import './database'
import './passport'

const PORT = process.env.PORT || 8000;
const server = Server({ games: [WattMatrix] })

const SINGLE_PORT = process.env.SINGLE_PORT

server.app.keys = ['secret']  // TODO
server.app.use(session({store: new MongooseStore({collection: 'sessions'})}, server.app))
// server.app.use(koaBody())

// TODO: Remove in production?
server.app.use(async (ctx, next) => {
    await next();
    console.log(`${ctx.method} ${ctx.url}`);
});


server.app.use(passport.initialize())
server.app.use(passport.session())

addRoutes(server.router)

server.app.use(async (ctx, next) => {
    // TODO: password protect more routes
    if (ctx.url == '/games') {
        if (ctx.isAuthenticated()) {
            console.log(ctx.state.user.username)
            return next()
        } else {
            ctx.status = 401
        }
    } else {
        await next();
    }
});

if (SINGLE_PORT) {
    // Build path relative to the server.js file
    const frontEndAppBuildPath = path.resolve(__dirname, '../build');
    server.app.use(serve(frontEndAppBuildPath))
}

server.run(PORT)
