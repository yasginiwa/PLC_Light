const net = require('net')
const { encodeInstruction } = require('./tools')

class TcpServer {
    //  单例模式
    static getInstance() {
        if (!TcpServer.instance) {
            TcpServer.instance = new TcpServer()
        }
        return TcpServer.instance
    }

    constructor() {
        return new Promise((resolve, reject) => {
            let server = net.createServer(client => {

                console.log('客户端已连接')

                resolve(client)
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

module.exports = TcpServer.getInstance()
