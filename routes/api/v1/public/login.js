const router = require('koa-router')()
const dao = require('../../../../modules/dao')
const { sign } = require('jsonwebtoken')
const { jwt_config } = require('../../../../config/default')
const tools = require('../../../../modules/tools')

router.post('/', async (ctx, next) => {

    let username = ctx.request.body.username
    let queryResult = await dao.execQuery(`select * from t_users where username = '${username}'`)
    let user = queryResult[0]

    if (queryResult.length === 0) { //  查询到的结果长度为0 用户不存在
        ctx.sendResult(null, 404, '用户名不存在')
    } else {    //  查询到此用户
        //  验证密码
        const validation = tools.comparePassword(ctx.request.body.password, user.password)

        if (validation) {    //  密码正确
            //  jwt签名
            const payload = { id: user.id, username: user.username, mobile: user.mobile, avatar: user.avatar }
            const token = `Bearer ${sign(payload, jwt_config.secretOrKey, { expiresIn: jwt_config.expiresIn })}`
            //  登录成功返回结果
            ctx.sendResult({ token, 'user': payload }, 200, '登录成功')
        } else {    //  密码错误
            ctx.sendResult(null, 400, '用户名或密码错误')
        }

    }
    next()
})

module.exports = router.routes()