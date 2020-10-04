import { Server } from 'boardgame.io/server';
import path from 'path';
import cors from '@koa/cors';
import serve from 'koa-static';
import session from 'koa-session'
import passport from 'koa-passport'
import MongooseStore from 'koa-session-mongoose'
import { StorageCache } from 'bgio-storage-cache'

import { WattMatrix } from '../src/Game';

import { addRoutes } from './routes'
import './database'
import './passport'
import { MongoStore } from '../db/mongo'

// Use the player ID as the credentials
const generateCredentials = (ctx) => {
    if (ctx.isAuthenticated()) {
        return ctx.state.user.id
    } else {
        throw new Error('user is not logged in')
    }
}

const PORT = process.env.PORT || 8000;
const db = new MongoStore()
const dbWithCaching = new StorageCache(db, {cacheSize: 200})
const server = Server({ games: [WattMatrix], generateCredentials: generateCredentials, db: dbWithCaching})

const SINGLE_PORT = process.env.SINGLE_PORT

// TODO: I think this is duplicate middle ware, but important to allow connections
//          Should be only in dev environment (or when not single port)
server.app.use(cors({credentials: true}))

server.app.keys = ['secretwer']  // TODO
server.app.use(session({store: new MongooseStore({collection: 'sessions'})}, server.app))

// TODO: Remove in production?
// server.app.use(async (ctx, next) => {
//     console.log(`${ctx.method} ${ctx.url}`);
//     await next();
// });


server.app.use(passport.initialize())
server.app.use(passport.session())

addRoutes(server.router)

if (SINGLE_PORT) {
    // Build path relative to the server.js file
    const frontEndAppBuildPath = path.resolve(__dirname, '../build');
    server.app.use(serve(frontEndAppBuildPath))
}

server.run(PORT)
