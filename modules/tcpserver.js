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

    constructor(instruction, options) {

        this.instruction = instruction || ''

        this.options = options || function (client) {
            console.log('客户端连接')
            client.on('data', data => {
                console.log(data.toString('hex'))
            })

            if (this.instruction) {
                client.write(encodeInstruction(this.instruction))
            }

            client.on('end', () => {
                console.log('客户端断开连接')
            })

            client.on('error', error => {
                console.log('连接错误', error)
            })
        }

        console.log(this.instruction, this.options)

        this.server = net.createServer(this.options)

        this.server.listen(60001, () => {
            console.log('TCP Server is running on 127.0.0.1:60001')
        })

    }







    // changeOptions(client, successCB, failCB) {
    //     client.on('data', data => {
    //         console.log(data)
    //         successCB(data)
    //     })

    //     if (this.instruction) {
    //         client.write(encodeInstruction(this.instruction))
    //     }

    //     client.on('end', () => {
    //         console.log('客户端断开连接')
    //     })

    //     client.on('error', error => {
    //         failCB(error)
    //     })
    // }

    // tcpConfig(client) {
    //     return new Promise((resolve, reject) => {
    //         console.log('客户端已连接')

    //         client.on('data', data => {
    //             resolve(data)
    //         })

    //         if (this.instruction) {
    //             client.write(encodeInstruction(this.instruction))
    //         }

    //         client.on('end', () => {
    //             console.log('客户端断开连接')
    //         })

    //         client.on('error', error => {
    //             reject(error)
    //         })
    //     })
    // }

}

module.exports = TcpServer

// module.exports = function TCPServer(instruction) {

//     return new Promise((resolve, reject) => {
//         const server = net.createServer((client) => {
//             // 'connection' 监听器。
//             console.log('客户端已连接')

//             client.setTimeout(3000)

//             client.write(instruction)

//             client.on('data', data => {
//                 resolve(data.toString('hex'))
//             })

//             client.on('end', () => {
//                 console.log('客户端已断开连接')
//             })
//         })

//         server.on('timeout', () => {
//             console.log('超时')
//         })

//         server.on('error', (err) => {
//             if (err === 'EADDRINUSE') {
//                 server.close()
//             }
//             reject(err)
//         })

//         server.close()

//         server.listen(60001, () => {
//             console.log('TCP Server is running on 127.0.0.1:60001')
//         })
//     })
// }


