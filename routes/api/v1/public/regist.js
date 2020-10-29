const router = require('koa-router')()
const dao = require('../../../../modules/dao')
const tools = require('../../../../modules/tools')

router.post('/', async (ctx, next) => {
    const { username, password, mobile, email, avatar } = ctx.request.body
    const newUser = { username: username, password: tools.enbcrypt(password), mobile: mobile, email: email, avatar: avatar }
    //  请求参数不完全
    if (!username || !password || !mobile || !email || !avatar) {
        ctx.sendResult(null, 401, '参数错误')
        return
    }
    const result = await dao.execQuery(`insert into t_users values (null, '${username}', '${password}', '${mobile}', '${email}', '${avatar}', default)`)

    if (result) {
        ctx.sendResult({ username: newUser.username, mobile: newUser.mobile, email: newUser.email, avatar: newUser.avatar }, 200, '注册用户成功')
    } else {
        ctx.sendResult(null, 400, '注册用户失败')
    }
})

module.exports = router.routes()