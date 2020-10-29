const net = require('net')

module.exports = function createTCPServer() {
    const server = net.createServer((client) => {
        // 'connection' 监听器。
        console.log('客户端已连接')

        client.on('end', () => {
            console.log('客户端已断开连接')
        })
    })

    server.on('data', data => {
        console.log(`服务器接收到数据:${data}`)
    })

    server.on('error', (err) => {
        throw err
    })

    server.listen(60001, () => {
        console.log('TCP Server is running on 127.0.0.1:60001');
    })
}


