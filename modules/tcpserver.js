const net = require('net')
const { encodeInstruction } = require('./tools')
const { singleRelayStatus } = require('../config/default')

class TcpServer {
    //  单例模式
    static getInstance() {
        if (!TcpServer.instance) {
            TcpServer.instance = new TcpServer()
        }
        return TcpServer.instance
    }

    constructor() {

            this.server = net.createServer(client => {

                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 已连接`)

                client.setTimeout(30000, () => {
                    console.log('TCP连接超时')
                })

                // client.on('data', data => {
                //     console.log(data)
                //     resolve(data)
                // })

                client.on('end', () => {
                    console.log('客户端断开连接')
                })

                client.on('error', error => {
                    client.destroy()
                })

            })

            // server.on('data', data => {
            //     console.log(data)
            // })

            this.server.on('error', error => {
                console.log('TCP服务器出错')
            })

            this.server.listen(60001, () => {
                console.log('TCP Server is running on 127.0.0.1:60001')
            })
    }
}

module.exports = TcpServer.getInstance()
