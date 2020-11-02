const net = require('net')
const { resolve } = require('path')
const { encodeInstruction } = require('./tools')

class TcpServer {
    //  单例模式
    static getInstance() {
        if (!TcpServer.instance) {
            TcpServer.instance = new TcpServer()
        }
        return TcpServer.instance
    }

    constructor(instruction) {
        this.instruction = instruction
        this.server = net.createServer(client => {
            console.log('客户端已连接')

            this.client = client


            // })

            // this.server.on('error', err => {
            //     reject(err)
            // })

            this.server.listen(60001, () => {
                console.log('TCP Server is running on 127.0.0.1:60001')
            })

        })
    }

    startService() {

        return new Promise((resolve, reject) => {
            if (this.instruction) {
                this.client.write(encodeInstruction(this.instruction))
            }
    
            this.client.on('data', data => {
                resolve(data)
            })
    
            this.client.on('end', () => {
                console.log('客户端已断开连接')
            })

            this.client.on('error', err => {
                reject(err)
            })
        })


        
    }

}

module.exports = TcpServer.getInstance()

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


