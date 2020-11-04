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
    let ch = channel ? openRelay.ch0 : openRelay.ch1
    //  crc16校验码
    let sum = crc16.checkSum(equipAddr + ch)

    let instruction = equipAddr + ch + sum

    let tc = await require('../../../../modules/tcpserver').catch(err => {
        ctx.sendResult({ data: err }, 400, '指令发送失败')
        return
    })

    tc.write(encodeInstruction(instruction))

    const res = await new Promise(resolve => {
        tc.on('data', data => {
            resolve(data)
        })
    })


    ctx.sendResult({ data: res.toString('hex') }, 200, '指令发送成功')

    next()
})

module.exports = router.routes()