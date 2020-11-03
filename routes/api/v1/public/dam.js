const router = require('koa-router')()
const net = require('net')
const { encodeInstruction, decodeKeepAlive } = require('../../../../modules/tools')


const testStr = 'fe050000ff009835'

//  第一路继电器开
const setChannel_1OnStr = 'fe050000ff009835'
//  第一路继电器关
const setChannel_1OffStr = 'fe0500000000d9c5'

//  第二路继电器开
const setChannel_2OnStr = 'fe050001ff00c9f5'
//  第二路继电器关
const setChannel_2OffStr = 'fe05000100008805'

router.get('/', async (ctx, next) => {

    let tc = await require('../../../../modules/tcpserver')

    tc.write(encodeInstruction(setChannel_1OnStr))

    // const instruction = setChannel_1OnStr

    // const options = client => {

    //     client.on('data', data => {
    //         console.log(data.toString('hex'))

    //         ctx.sendResult({ data }, 200, '操作成功')
    //     })
    // }

    // TcpServer.getInstance(instruction, options)


    // const res = await tcpServer.catch(err => {
    //     if (err) { // 重复发用一条指令 报address already in use错误 换成相反状态指令
    //         console.log(err)
    //         ctx.sendResult(null, 400, '操作失败')
    //         return
    //     }
    // })


    // const res = await tcpServer.tcpConfig().catch(err => {
    //     if (err) { // 重复发用一条指令 报address already in use错误 换成相反状态指令
    //         console.log(err)
    //         ctx.sendResult(null, 400, '操作失败')
    //         return
    //     }
    // })


    next()
})

module.exports = router.routes()