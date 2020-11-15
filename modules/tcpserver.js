const net = require('net')
const { encodeInstruction } = require('./tools')
const dao = require('./dao')


class TcpServer {
    //  单例模式
    static getInstance() {
        if (!TcpServer.instance) {
            TcpServer.instance = new TcpServer()
        }
        return TcpServer.instance
    }

    constructor() {
        this.clients = []

        this.server = net.createServer(client => {

            console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 已连接`)

            client.setTimeout(3000, () => {
                console.log('TCP连接超时')
            })

            client.emitClose = true
            client.autoDestroyed = true

            this.clients.push(client)

            // client.on('data', data => {
            //     if (data.length !== 45) return
            //     let snStr = data.slice(15, 31).toString()
            //     this.responses.push(snStr)
            // })
            client.on('data', async data => {
                console.log(data.length)
                // if (data.length !== 45) return
                // let snStr = data.slice(15, 31).toString()
                if (data.length !== 16) return
                let snStr = data.toString()
                //  先把所有的继电器在线状态设置为0 离线
                let setOfflineCount = await dao.execQuery(`update t_relay set online_count = (online_count + 1) where sn <> '${snStr}'`)
                //  根据data事件继电器回复的sn码 在数据库中找到回复探测包的继电器
                let queryRes = await dao.execQuery(`select id from t_relay where sn = '${snStr}'`)
                //  更新所有在线继电器的状态为1 （回复探测包的继电器）
                await dao.execQuery(`update t_relay set online_count = 0, online = 1, ip_address = '${client.remoteAddress.substr(7, 12)}' where id = ${queryRes[0].id}`)
                // let updateRes = await dao.execQuery(`update t_relay set online = 1 where id = ${queryRes[0].id}`)

                //  当某个继电器的online_count递增到4时 设置online_count=0 并且设置online = 0
                let inactiveClients =  await dao.execQuery(`select id from t_relay where online_count >= 4`)
                inactiveClients.forEach(async v => {
                    await dao.execQuery(`update t_relay set online = 0, online_count = 0 where id = ${v.id}`)
                });
                
            })

            client.on('destroy', () => {
                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 销毁连接`)

                let index = this.clients.indexOf(client); // 找到当前client的index

                this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端
            })

            client.on('close', () => {
                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 断开连接`)

                let index = this.clients.indexOf(client); // 找到当前client的index

                this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端
            })

            client.on('error', error => {
                console.log(`客户端 ${client.remoteAddress.substr(7, 12)}:${client.remotePort} 连接出错`)

                let index = this.clients.indexOf(client); // 找到当前client的index

                this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端

                client.destroy()
            })

        })

        this.server.on('error', error => {
            console.log('TCP服务器出错')
        })

        this.server.listen(60001, () => {
            console.log('TCP Server is running on 127.0.0.1:60001')
        })
    }

    connectedClients() {
        let client = {}
        this.clients = this.clients.reduce((cur, next) => {
            client[next.remoteAddress] ? '' : client[next.remoteAddress] = true && cur.push(next)
            return cur
        }, [])
        return this.clients
    }

}

module.exports = TcpServer.getInstance()
