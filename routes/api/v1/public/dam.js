const router = require('koa-router')()
const net = require('net')
const { encodeInstruction, decodeKeepAlive } = require('../../../../modules/tools')
const tcpServer = require('../../../../modules/tcpserver')

//  第一路继电器开
const setChannel_1OnStr = 'fe 05 00 00 ff 00 98 35'
//  第二路继电器开
const setChannel_2OnStr = 'fe 05 00 01 ff 00 c9 f5'
//  第一路继电器关
const setChannel_1OffStr = 'fe 05 00 00 00 00 d9 c5'
//  第二路继电器关
const setChannel_2OffStr = 'fe 05 00 01 00 00 88 05'
//  心跳码
const keepAliveStr = 'fe 04 03 e8 00 14 64 7a'

router.get('/', async (ctx, next) => {

    const res = await tcpServer(encodeInstruction(setChannel_1OnStr)).catch(err => console.log(err))


    ctx.body = {
        res
    }

    // tcpClient.write(encodeInstruction(setChannel_1OnStr))

    // let server = net.createServer(function (connection) {
    //     console.log('client connected');
    //     connection.on('end', function () {
    //         console.log('客户端关闭连接');
    //     });


    //     connection.on('data', (data) => {
    //         console.log(data)
    //         connection.write(Buffer.from(status));
    //         console.log(Buffer.from(status))
    //     })

    // });
    // server.listen(60001, function () {
    //     console.log('server is listening');
    // });

    // let client = net.connect(10000, '192.168.5.232', () => {
    //     console.log('connected')
    // })

    // client.write(encodeInstruction(setChannel_1OffStr))

    // client.on('data', (data) => {
    //     console.log(data.toString('hex'))

    //     client.end()
    // })

    // client.on('end', () => {
    //     console.log('disconnected')
    // })

    // ctx.body = {
    //     res: data.toString('hex')
    // }

    next()
})

module.exports = router.routes()