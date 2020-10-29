/**
 * passport.js的回调 
 */

const dao = require('../modules/dao')
const { jwt_config } = require('../config/default')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwt_config.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        const result = await dao.execQuery(`select * from t_users where id = ${jwt_payload.id}`)

        if(result.length === 0) {
            return done(null, false)
        } else {
            const authrizedUser = result[0]
            return done(null, authrizedUser)
        }
        // User.findOne({id: jwt_payload.sub}, (err, user) => {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //         // or you could create a new account
        //     }
        // });
        
    }));
}