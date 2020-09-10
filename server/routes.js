import passport from 'koa-passport'
import bcrypt from 'bcryptjs'
import koaBody from 'koa-body'

import User from './database'

async function ping(ctx) {
    console.log(ctx.isAuthenticated())
    console.log('pong')
    ctx.body = 'pong'
    return ctx
}


// TODO: Just return a 200 and the username, or a 403 not auth otherwise.
const login = passport.authenticate('local', {successRedirect: '/login-success'})

// TODO redirects not working
async function register(ctx) {
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    User.findOne({ username: username }).then(user => {
        if (user) {
            console.log('existing user')
            ctx.redirect('login-fail')
        } else {
            console.log('creating user ' + username)
            const newUser = new User({
                username: username,
                password: bcrypt.hashSync(password)
            })
            newUser.save().then( ctx.redirect('/login-success') )
        }
    }).catch(err => { 
        console.log('register error')
        ctx.redirect('/login-fail')
    })
}

async function loginSuccess(ctx) {
    console.log('logged in')
    ctx.body = 'logged in'
    return ctx
}

async function loginFail(ctx) {
    console.log('failed to log in')
    ctx.body = 'failed to log in'
    return ctx
}


export function addRoutes(router) {
    router.get('/ping', koaBody(), ping)
    router.post('/login', koaBody(), login)
    router.post('/register', koaBody(), register)
    router.get('/login-success', koaBody(), loginSuccess)
    router.get('/login-fail', koaBody(), loginFail)
}