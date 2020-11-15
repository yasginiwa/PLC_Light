const router = require('koa-router')()
const { encodeInstruction } = require('../../../../modules/tools')
const { openSingleRelay, closeSingleRelay, openAllRelay, closeAllRelay, singleRelayStatus } = require('../../../../config/default')
const crc16 = require('node-crc16')
const dao = require('../../../../modules/dao')
const TCPServer = require('../../../../modules/tcpserver')


//  添加设备 shopno 店号 relaysn 网络继电器sn码 relaytype 网络继电器型号 relaychannel 网络继电器通道数
router.post('/add', async (ctx, next) => {
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

    if (result) {
        ctx.sendResult({ data: { shopno, relaytype, relaysn, relaychannel } }, 200, '添加继电器设备成功')
    } else {
        ctx.sendResult(null, 400, '添加继电器设备失败')
    }

    next()
})

//  获取所有设备 并返回在线信息
router.get('/', async (ctx, next) => {

    //  获取所有连接的继电器数组
    // clients = TCPServer.connectedClients()

    // clients.forEach((v, i) => {
    //     let equipAddr = parseInt(i + 1).toString(16).padStart(2, 0)

    //     let sum = crc16.checkSum(equipAddr + singleRelayStatus.status)

    //     let statusInstruction = equipAddr + singleRelayStatus.status + sum

    //     console.log(statusInstruction)

    //     //  遍历发出探测继电器指令
    //     v.write(encodeInstruction(statusInstruction))
    // })

    //  获取所有已添加到数据库的门店的活跃继电器
    let activeClients = await dao.execQuery(`select shop.no, relay.type, relay.sn, relay.online from t_shop as shop inner join t_relay as relay on shop.relay = relay.id`).catch(error => {
        ctx.sendResult(null, 400, '获取继电器设备信息失败')
        return
    })

    ctx.sendResult({ data: activeClients }, 200, '获取继电器在线信息成功')

    next()
})

//  操作单个(门店)继电器设备单个/多个通道 channel 参数: '0'代表第D0通道(设备显示第2通道) '1'代表D1通道 'all'代表所有通道 
router.put('/', async (ctx, next) => {
    const { oprtype, channel, shopid } = ctx.request.body
    //  设备地址
    let equipAddr = parseInt(shopid).toString(16).padStart(2, 0)
    //  操作通道
    let ch = ''

    //  操作单通道或者所有通道 标记 true为所有通道 false为单通道
    let flag = isNaN(parseInt(channel)) || parseInt(channel) > 1

    //  查数据库 找出要操作的继电器id
    let relays = await dao.execQuery(`select relay from t_shop where no = ${shopid}`)

    if (flag) {
        if (oprtype === 'open') {
            ch = openAllRelay.ch_all
            await dao.execQuery(`update t_relay set channel_1 = 1, channel_2 = 1 where id = ${relays[0].relay}`)
        } else if (oprtype === 'close') {
            ch = closeAllRelay.ch_all
            await dao.execQuery(`update t_relay set channel_1 = 0, channel_2 = 0 where id = ${relays[0].relay}`)
        } else {
            ctx.sendResult(null, 400, '参数错误')
            return
        }
    } else {
        if (oprtype === 'open') {
            if (channel === '0') {
                ch = openSingleRelay.ch0
                await dao.execQuery(`update t_relay set channel_2 = 1 where id = ${relays[0].relay}`)
            } else {
                ch = openSingleRelay.ch1
                await dao.execQuery(`update t_relay set channel_1 = 1 where id = ${relays[0].relay}`)
            }

            // ch = (channel === '0' ? openSingleRelay.ch0 : openSingleRelay.ch1)
        } else if (oprtype === 'close') {
            if (channel === '0') {
                ch = closeSingleRelay.ch0
                await dao.execQuery(`update t_relay set channel_2 = 0 where id = ${relays[0].relay}`)
            } else {
                ch = closeSingleRelay.ch1
                await dao.execQuery(`update t_relay set channel_1 = 0 where id = ${relays[0].relay}`)
            }

            // ch = (channel === '0' ? closeSingleRelay.ch0 : closeSingleRelay.ch1)
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
    clients = TCPServer.connectedClients()

    // let activeClients = await dao.execQuery(`select shop.no, relay.type, relay.sn, relay.online from t_shop as shop inner join t_relay as relay on shop.relay = relay.id`).catch(error => {
    //     ctx.sendResult(null, 400, '获取继电器设备信息失败')
    // })

    //  查询数据库 查出offline（离线）的继电器设备的ip地址
    let offlineClients = await dao.execQuery(`select ip_address from t_relay where online = 0`)

    //  查询出要操作的该门店的继电器ID
    let oprRelays = await dao.execQuery(`select relay from t_shop where no = ${parseInt(shopid)}`)

    //  查询出该id继电器的ip地址 在线状态
    let oprRelayInfos = await dao.execQuery(`select ip_address, online, sn from t_relay where id = ${oprRelays[0].relay}`)

    //  数据库查询结果为数组 从数组中拿出当前要操作的继电器对象信息
    let oprRelayInfo = oprRelayInfos[0]

    //  遍历已存在的socket数组 找出ip地址和要操作继电器ip地址相同的socket 进行后续的操作
    let client = await new Promise((resolve, reject) => {
        clients.forEach(v => {
            if(v.remoteAddress.substr(7, 12) === oprRelayInfo.ip_address) {
                resolve(v)
            }
        })
    })


    if (oprRelayInfo.online) {
        client.write(encodeInstruction(instruction))
        ctx.sendResult({ shopid, channel, oprtype }, 200, '操作成功')
    } else {
        ctx.sendResult(null, 400, `门店 ${shopid} 设备sn号 ${oprRelayInfo.sn} 不在线 操作失败`)
    }

    // clients.forEach(v => {

    // })

    // console.log(offlineClients)


    //  tc写指令
    // clients.forEach(v => {
    //     let ip_address = v.remoteAddress.substr(7, 12)


    //     //  TODO: 当发送指令是 先检测设备在线状态当发送指令是 先检测设备在线状态
    //     offlineClients.forEach(v => {
    //         console.log(v.ip_address)
    //         if(v.ip_address === ip_address) {
    //             console.log(v.ip_address)
    //             ctx.sendResult(null, 400, `设备 ${onlineStatuses.sn} 不在线 操作失败`)
    //             return
    //         } else {
    //             //  接口返回数据
    //             ctx.sendResult({ shopid, channel, oprtype }, 200, '操作成功')
    //         }
    //     })

    //     v.write(encodeInstruction(instruction))
    // })



    next()
})


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