const router = require('koa-router')()
const net = require('net')
const { encodeInstruction } = require('../../../../modules/tools')
const { openRelay, closeRelay, openAllRelay, closeAllRelay } = require('../../../../config/default')
const crc16 = require('node-crc16')

//  获取所有设备在线信息
router.get('/', async (ctx, next) => {

    let tc = await require('../../../../modules/tcpserver').catch(err => {
        ctx.sendResult({ data: err }, 400, '指令发送失败')
        return
    })

    tc.write(encodeInstruction(testStr))

    const res = await new Promise(resolve => {
        tc.on('data', data => {
            resolve(data)
        })
    })

    ctx.sendResult({ data: res.toString('hex') }, 200, '指令发送成功')

    next()
})

//  操作单个设备
router.get('/equipopr', async (ctx, next) => {
    const { oprtype, channel, shopid } = ctx.request.query
    //  设备地址
    let equipAddr = parseInt(shopid).toString(16).padStart(2, 0)
    //  操作通道
    let ch = ''
    if (oprtype === 'open') {
        ch = channel ? openRelay.ch1 : openRelay.ch0
    } else {
        ch = channel ? closeRelay.ch1 : closeRelay.ch0
    }
    //  crc16校验码
    let sum = crc16.checkSum(equipAddr + ch)
    //  拼接操作指令
    let instruction = equipAddr + ch + sum

    console.log(instruction)
    //  tc = tcpClient 获取tcp服务器中的client
    let tc = await require('../../../../modules/tcpserver').catch(err => {
        ctx.sendResult({ data: err }, 400, '操作失败')
        return
    })
    //  tc写指令
    tc.write(encodeInstruction(instruction))

    //  tcp服务器接收返回指令
    const res = await new Promise(resolve => {
        tc.on('data', data => {
            resolve(data)
        })
    })
    //  接口返回数据
    ctx.sendResult({ shopid, channel, oprtype }, 200, '操作成功')

    next()
})

module.exports = router.routes()