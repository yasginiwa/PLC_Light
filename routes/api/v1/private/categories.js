const router = require('koa-router')()
const dao = require('../../../../modules/dao')
const passport = require('koa-passport')

//  获取分类列表
router.get('/', passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    if (ctx.state.user) {   //认证成功
        const categories = await dao.execQuery(`select * from t_categories`)
        ctx.sendResult({ categories }, 200, '获取分类列表成功')
    }
    next()
})

//  添加分类
router.post('/', passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    if (ctx.state.user) {   //认证成功
        const { name, pid, p_level } = ctx.request.body
        //  请求参数不完全
        if (!name || !pid || !p_level) {
            ctx.sendResult(null, 401, '参数错误')
            return
        }
        const addRes = await dao.execQuery(`insert into t_categories values (null, '${name}', ${pid}, ${p_level})`)
        if (addRes) {
            const cateRes = await dao.execQuery(`select * from t_categories where name = '${name}'`)
            ctx.sendResult(cateRes[0], 201, '添加分类成功')
        }
    }
    next()
})

//  根据id查询分类
router.get('/:id', passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    if (ctx.state.user) {
        const queryRes = await dao.execQuery(`select * from t_categories where id = ${ctx.params.id}`)
        if (queryRes) {
            ctx.sendResult(queryRes[0], 200, '查询成功')
        }
    }
    next()
})

//  根据id修改分类信息
router.put('/:id', passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    const newName = ctx.request.body.name
    if (ctx.state.user) {
        const modifyRes = await dao.execQuery(`update t_categories set name = '${newName}' where id = ${ctx.params.id}`).catch(err => {
            ctx.sendResult({error: err}, 400, '修改失败')
        })
        if (modifyRes.affectedRows !== 0) {
            const cateRes = await dao.execQuery(`select * from t_categories where id = ${ctx.params.id}`)
            ctx.sendResult(cateRes[0], 201, '修改成功')
        } else {
            ctx.sendResult(null, 401, '无此分类，修改失败')
        }
    }
    next()
})

//  根据id删除分类信息
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (ctx, next) => {
    if (ctx.state.user) {
        const deleteRes = await dao.execQuery(`delete from t_categories where id = ${ctx.params.id}`).catch(err => ctx.sendResult(null, 401, '删除分类失败'))
        ctx.sendResult(null, 200, '删除分类成功')
    }
    next()
})

module.exports = router.routes()