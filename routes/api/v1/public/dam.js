const router = require('koa-router')()
const net = require('net')
const { encodeInstruction } = require('../../../../modules/tools')
const { openSingleRelay, closeSingleRelay, openAllRelay, closeAllRelay } = require('../../../../config/default')
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

//  操作单个(门店)设备单个/多个通道 channel 参数: '0'代表第D0通道 '1'代表第1通道 'all'代表所有通道 
router.get('/singleEquipOpr', async (ctx, next) => {
    const { oprtype, channel, shopid } = ctx.request.query
    //  设备地址
    let equipAddr = parseInt(shopid).toString(16).padStart(2, 0)
    //  操作通道
    let ch = ''

    //  操作单通道或者所有通道 标记 true为所有通道 false为单通道
    let flag = isNaN(parseInt(channel)) 

    if (flag) {
        if (oprtype === 'open') {
            ch = openAllRelay.ch_all
        } else if (oprtype === 'close') {
            ch = closeAllRelay.ch_all
        } else {
            ctx.sendResult(null, 400, '参数错误')
            return
        }
    } else {
        if (oprtype === 'open') {
            ch = (channel === '0' ? openSingleRelay.ch0 : openSingleRelay.ch1)
        } else if (oprtype === 'close') {
            ch = (channel === '0' ? closeSingleRelay.ch0 : closeSingleRelay.ch1)
        } else {
            ctx.sendResult(null, 400, '参数错误')
            return
        }
    }

    //  crc16校验码
    let sum = crc16.checkSum(equipAddr + ch)
    //  拼接操作指令
    let instruction = equipAddr + ch + sum

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

//  操作单个设备所有通道




//  操作所有的设备的所有通道
router.get('/equipallopr', async (ctx, next) => {

    const { oprtype } = ctx.request.query

    let channel = 1

    for (let shopid = 0; shopid < 3; shopid++) {
        //  设备地址
        let equipAddr = parseInt(shopid).toString(16).padStart(2, 0)
        //  操作通道
        let ch = ''
        if (oprtype === 'open') {
            ch = (channel === '0' ? openRelay.ch0 : openRelay.ch1)
        } else if (oprtype === 'close') {
            ch = (channel === '0' ? closeRelay.ch0 : closeRelay.ch1)
        } else {
            ctx.sendResult(null, 400, '参数错误')
        }
        //  crc16校验码
        let sum = crc16.checkSum(equipAddr + ch)
        //  拼接操作指令
        let instruction = equipAddr + ch + sum

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
    }

    next()
})

module.exports = router.routes()