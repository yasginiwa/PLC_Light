//  添加统一的返回结果方法
module.exports = async (ctx, next) => {
    ctx.sendResult = (data, code, message) => {
        ctx.body = {
            "data": data,
            "meta": {
                "status": code,
                "msg": message
            }
        }
    }
    await next()
}