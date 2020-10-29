const net = require('net')

module.exports = function TCPServer(instruction) {

    return new Promise((resolve, reject) => {
        const server = net.createServer((client) => {
            // 'connection' 监听器。
            console.log('客户端已连接')

            client.write(instruction)
    
            client.on('data', data => {
                resolve(data.toString('hex'))
            })
    
            client.on('end', () => {
                console.log('客户端已断开连接')
            })
        })

        server.write
    
        server.on('error', (err) => {
            reject(err)
        })
    
        server.listen(60001, () => {
            console.log('TCP Server is running on 127.0.0.1:60001');
        })
    })
}


