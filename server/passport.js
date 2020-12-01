import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcryptjs'

import User from '../db/user'

const verifyCallback = (username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
            if (!user) { return done(null, false) }
            
            const isValid = bcrypt.compareSync(password, user.password)
            
            if (isValid) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch((err) => {   
            done(err)
        });

}

passport.serializeUser(function(user, done) { done(null, user.id) })

passport.deserializeUser(function(userId, done) {
    // TODO: This means a lot of DB calls, there probably is a better way.
    User.findById(userId)
        .then((user) => { done(null, user) })
        .catch(err => done(err))
})

passport.use(new LocalStrategy(verifyCallback))
