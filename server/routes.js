import passport from 'koa-passport'
import bcrypt from 'bcryptjs'
import koaBody from 'koa-body'

import User from '../db/user'

async function auth(ctx) {
    if (ctx.isAuthenticated()) {
        ctx.body = {username: ctx.state.user.username, id: ctx.state.user.id}
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

export function addRoutes(router) {
    router.get('/auth', auth)
    router.post('/login', koaBody(), login)
    router.post('/logout', logout)
    router.post('/signup', koaBody(), signup)
}