const router = require('koa-router')()
const { encodeInstruction } = require('../../../../modules/tools')
const { openSingleRelay, closeSingleRelay, openAllRelay, closeAllRelay, singleRelayStatus } = require('../../../../config/default')
const crc16 = require('node-crc16')
const dao = require('../../../../modules/dao')
const TCPServer = require('../../../../modules/tcpserver')

//  添加设备 shopno 店号 relaysn 网络继电器sn码 relaytype 网络继电器型号 relaychannel 网络继电器通道数
router.post('/add', async(ctx, next) => {
    let { shopno, relaysn, relaytype, relaychannel } = ctx.request.body
    //  请求参数不完全
    if (!shopno || !relaysn || !relaytype || !relaychannel) {
        ctx.sendResult(null, 401, '参数错误')
        return
    }

    await dao.execQuery(`insert into t_relay values (null, '${relaytype}', '${relaysn}', ${parseInt(relaychannel)}, default)`).catch(error => {
        ctx.sendResult(null, 400, '添加继电器设备失败')
        return
    })

    const resultArr = await dao.execQuery(`select id from t_relay where sn = '${relaysn}'`).catch(error => {
        ctx.sendResult(null, 400, '添加继电器设备失败')
        return
    })

    let relayID = resultArr[0].id

    const result = await dao.execQuery(`insert into t_shop values (null, ${shopno}, ${relayID}, null, default, default)`).catch(error => {
        ctx.sendResult(null, 400, '添加继电器设备失败')
        return
    })

    if(result) {
        ctx.sendResult({ data: {shopno, relaytype, relaysn, relaychannel}}, 200, '添加继电器设备成功')
    } else {
        ctx.sendResult(null, 400, '添加继电器设备失败')
    }

    next()
})

//  获取所有设备 并返回在线信息
router.get('/', async (ctx, next) => {

    let relays = await dao.execQuery(`select shop.no, relay.type, relay.sn from t_shop as shop inner join t_relay as relay on shop.relay = relay.id`)

    TCPServer.server.on('connection', socket => {
        socket.on('data', data => {
            console.log(data)
        })
    })

    // relays.forEach(v => {
    //     v.no
    // })

    // let clientList = await require('../../../../modules/tcpserver')

    // let activeList = []

    // clientList.forEach((v, i) => {

    //     let equipAddr = parseInt(i + 1).toString(16).padStart(2, 0)

    //     let sum = crc16.checkSum(equipAddr + singleRelayStatus.status)

    //     let statusInstruction = equipAddr + singleRelayStatus.status + sum

    //     console.log(statusInstruction)

    //     v.write(encodeInstruction(statusInstruction))

    //     v.on('data', data => {
    //         if (data.length === 45) {
    //             activeList.push(data)
    //             console.log(activeList)
    //         }
    //     })
    // })





    // let tc = await require('../../../../modules/tcpserver').catch(err => {
    //     ctx.sendResult({ data: err }, 400, '指令发送失败')
    //     return
    // })

    // tc.write(encodeInstruction(testStr))

    // const res = await new Promise(resolve => {
    //     tc.on('data', data => {
    //         resolve(data)
    //     })
    // })

    // ctx.sendResult({ data: res.toString('hex') }, 200, '指令发送成功')

    // myEmitter.on('getData', data => {
    //     if (data.length === 45) {
    //         console.log(data)
    //     }
    // })



    next()
})

//  操作单个(门店)继电器设备单个/多个通道 channel 参数: '0'代表第D0通道 '1'代表D1通道 'all'代表所有通道 
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
    let tcList = await require('../../../../modules/tcpserver').catch(err => {
        ctx.sendResult({ data: err }, 400, '操作失败')
        return
    })
    //  tc写指令
    tcList.forEach(v => {
        v.write(encodeInstruction(instruction))
        // //  tcp服务器接收返回指令
        // const res = new Promise(resolve => {
        //     tc.on('data', data => {
        //         resolve(data)
        //     })
        // })
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