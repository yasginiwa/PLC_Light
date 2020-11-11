const net = require('net')
const { encodeInstruction } = require('./tools')
const { singleRelayStatus } = require('../config/default')
const myEmitter = require('../modules/MyEmitter')

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

            let clientList = []

            let server = net.createServer(client => {

                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 已连接`)

                clientList.push(client)

                client.setTimeout(3000, () => {
                    console.log('TCP连接超时')
                })

                client.on('data', data => {
                    myEmitter.emit('getData', data)
                })

                client.on('close', () => {
                    console.log('客户端断开连接')
                    clientList.splice(clientList.indexOf(client), 1)
                })

                client.on('error', error => {
                    reject(error)
                    client.destroy()
                })

                resolve(clientList)

            })

            // server.on('data', data => {
            //     console.log(data)
            // })

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
