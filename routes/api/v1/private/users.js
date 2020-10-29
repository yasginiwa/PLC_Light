const router = require('koa-router')()
const dao = require('../../../../modules/dao')
const passport = require('koa-passport')
const { session } = require('koa-passport')

//  获取用户列表
router.get('/', passport.authenticate('jwt', {session: false}), async(ctx, next) => {
    if (ctx.state.user) {   //认证成功
        const users = await dao.execQuery(`select id, username, mobile, email, avatar, create_at from t_users`)
        ctx.sendResult({ users }, 200, '获取用户列表成功')
    } else {
        ctx.sendResult(null, 401, '未授权访问')
    }
    next()
})

module.exports = router.routes()