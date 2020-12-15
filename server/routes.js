import bcrypt from 'bcryptjs'
import koaBody from 'koa-body'
import passport from 'koa-passport'

import Game from '../db/game'
import User from '../db/user'

async function auth(ctx) {
    if (ctx.isAuthenticated()) {
        ctx.body = {username: ctx.state.user.username, id: ctx.state.user.id, isAdmin: ctx.state.user.isAdmin}
        ctx.status = 200
    } else {
        ctx.status = 401
    }
}

async function login(ctx) {
    return passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            console.log('error logging in')
            ctx.status = 400
        }
        if (user) {
            console.log(`${user.username} logged in.`)
            ctx.login(user)
            ctx.body = {isAdmin: user.isAdmin}
            ctx.status = 200
        } else {
            ctx.status = 401
        }
    })(ctx);
}

async function signup(ctx) {
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    const user = await User.findOne({username: username})
    if (user) {
        console.log('existing user')
        ctx.body = 'existing user'
        ctx.status = 400
    } else {
        console.log('creating user ' + username)
        const newUser = new User({
            username: username,
            password: bcrypt.hashSync(password)
        })
        await newUser.save()
        ctx.login(newUser)
        ctx.status = 201
    }
}

async function logout(ctx) {
    console.log('logout')
    ctx.logout()
    ctx.body = 'logged out'
}

async function deleteMatch(ctx) {
    if (ctx.isAuthenticated() && ctx.state.user.isAdmin) {
        await Game.findByIdAndDelete(ctx.request.body.matchID)
        ctx.status = 202
    } else {
        ctx.status = 401
    }
}

async function stats(ctx) {
    if (ctx.isAuthenticated()) {
        ctx.body = ctx.state.user.stats
        ctx.status = 200
    } else {
        ctx.status = 401
    }
}

/**
 * Calculate the lower bound of the Wilson confidence score interval for a player.
 *  From https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
 * 
* @param {Int} wins     Number of matches won.
 * @param {Int} n       Number of matches played.
 */
function wilsonScore(wins, n) {
    if (n === 0) {return 0}
    const phat = wins / n
    const confidence = 0.95
    const z = 1.96 // Standard normal for 95% confidence
    return (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat) + z*z/(4*n) / n))) / (1 + z*z/n)
}

async function leaderboard(ctx) {
    // Find stats for all users.
    const allStats = await User.find({stats: {$ne: null}}, {_id: 0, username: 1, stats: 1})
    let leaderboard = {}
    allStats.forEach(({username, stats}) => {
        for (const game in stats) {
            // Instantiate the game leaderboard if necessary.
            leaderboard[game] = leaderboard[game] || {}
            leaderboard[game][username] = {
                wins: stats[game].wins,
                matches: stats[game].matches,
                ratio: stats[game].wins / stats[game].matches,
                wscore: wilsonScore(stats[game].wins, stats[game].matches)
            }
        }
    })
    ctx.body = leaderboard
    ctx.status = 200
}

// Since the frontend and backend are served from the same port on Heroku, all server routes are
//  namespaced to prevent overlap.
export function addRoutes(router) {
    router.get('/server/auth', auth)
    router.post('/server/login', koaBody(), login)
    router.post('/server/logout', logout)
    router.post('/server/signup', koaBody(), signup)
    router.post('/server/delete', koaBody(), deleteMatch)
    router.get('/server/stats', koaBody(), stats)
    router.get('/server/leaderboard', leaderboard)
}