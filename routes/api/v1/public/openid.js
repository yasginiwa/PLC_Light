const axios = require('axios')
const router = require('koa-router')()
const { weapp_config } = require('../../../../config/default')

/**
 * 获取微信小程序openid
 */
router.post('/', async (ctx, next) => {
    //  小程序appid
    const appid = weapp_config.appid
    //  小程序密钥
    const secret = weapp_config.secret
    //  获取openid的js_code
    const js_code = ctx.request.body.js_code.code
    //  获取openid的grant_type
    const grant_type = 'authorization_code'

    //  初始化axios实例
    const instance = axios.create({
        baseURL: 'https://api.weixin.qq.com',
        timeout: 5000
    })

    const result = await instance({
        url: '/sns/jscode2session',
        params: {
            appid,
            secret,
            js_code,
            grant_type
        }
    }).catch(err => ctx.sendResult(err, 401, '获取openid失败'))

    //  获取openid成功
    if (result) {
        ctx.sendResult({ openid: result.data.openid }, 200, '获取openid成功')
    }
})

module.exports = router.routes()