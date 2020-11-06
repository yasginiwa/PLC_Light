const net = require('net')
const { encodeInstruction } = require('./tools')

class TcpServer {
    //  单例模式
    // static getInstance() {
    //     if (!TcpServer.instance) {
    //         TcpServer.instance = new TcpServer()
    //     }
    //     return TcpServer.instance
    // }

    constructor() {
        return new Promise((resolve, reject) => {
            let server = net.createServer(client => {
                
                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 已连接`)

                client.setTimeout(5000, () => {
                    console.log('TCP连接超时')
                })

                resolve(client)
            })

            server.maxConnections = 200

            server.on('data', data => {
                console.log(data)
            })

            server.on('error', error => {
                reject(error)
            })

            server.listen(60001, () => {
                console.log('TCP Server is running on 127.0.0.1:60001')
            })
        })
    }
}

module.exports = new TcpServer()
