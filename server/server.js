import { Server } from 'boardgame.io/server';
import path from 'path';
import cors from '@koa/cors';
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

// TODO: I think this is duplicate middle ware, but important to allow connections
//          Should be only in dev environment (or when not single port)
server.app.use(cors({credentials: true}))

server.app.keys = ['secretwer']  // TODO
server.app.use(session({store: new MongooseStore({collection: 'sessions'})}, server.app))

// TODO: Remove in production?
server.app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url}`);
    await next();
});


server.app.use(passport.initialize())
server.app.use(passport.session())

addRoutes(server.router)

// Is this necessary? probably not given that the front end is always checking username
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
