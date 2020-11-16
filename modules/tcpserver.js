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

            client.setKeepAlive(true)

            console.log(`客户端 ${client.remoteAddress.substr(7, client.remoteAddress.length)}:${client.remotePort} 已连接`)

            // client.on('data', data => {
            //     if (data.length !== 45) return
            //     let snStr = data.slice(15, 31).toString()
            //     this.responses.push(snStr)
            // })
            client.on('data', async data => {


                //  client首次连接 发出登录包 包内是门店信息 长度为1
                if (data.length == 1) {
                    client.id = data.toString('hex')
                    //  给每个客户端添加一个唯一id 用于区分每个client
                    if (this.clients.length === 0) {
                        this.clients.push(client)
                    } else {
                        this.clients.forEach(v => {
                            if (v.id !== client.id) {
                                console.log(`vid: ${v.id}, cid: ${client.id}`)
                                this.clients.push(client)
                            }
                        })
                    }


                    //  初次开启服务器 clients数组length为0 直接将客户端加入clients数组
                    // this.clients.push(client)

                    // if (this.clients.length) {
                    //     this.clients.forEach(v => {
                    //         if (v.id !== client.id) {
                    //             this.clients.push(client)
                    //         } else {
                    //             const vindex = this.clients.indexOf(v)
                    //             this.clients.splice(v, 1)
                    //             this.clients.push(client)
                    //         }
                    //     })
                    // }
                }


                this.clients.forEach(v => {
                    console.log('vid' + v.id)
                })

                // if (data.length !== 45) return
                // let snStr = data.slice(15, 31).toString()
                if (data.length !== 16) return
                let snStr = data.toString()
                //  先把所有的继电器在线状态设置为0 离线
                let setOfflineCount = await dao.execQuery(`update t_relay set online_count = (online_count + 1) where sn <> '${snStr}'`)
                //  根据data事件继电器回复的sn码 在数据库中找到回复探测包的继电器
                let queryRes = await dao.execQuery(`select id from t_relay where sn = '${snStr}'`)
                //  更新所有在线继电器的状态为1 （回复探测包的继电器）
                await dao.execQuery(`update t_relay set online_count = 0, online = 1, ip_address = '${client.remoteAddress.substr(7, client.remoteAddress.length)}' where id = ${queryRes[0].id}`)
                // let updateRes = await dao.execQuery(`update t_relay set online = 1 where id = ${queryRes[0].id}`)

                //  当某个继电器的online_count递增到4时 设置online_count=0 并且设置online = 0
                let inactiveClients = await dao.execQuery(`select id from t_relay where online_count >= 4`)
                inactiveClients.forEach(async v => {
                    await dao.execQuery(`update t_relay set online = 0, online_count = 0 where id = ${v.id}`)
                });

            })

            client.on('timeout', () => {
                console.log(`${client.remoteAddress.substr(7, client.remoteAddress.length)} 连接超时`)
            })

            client.on('end', () => {
                console.log('end')
            })

            client.on('drain', () => {
                console.log('drain')
            })

            client.on('destroy', () => {
                console.log(`客户端 ${client.remoteAddress.substr(7, client.remoteAddress.length)}:${client.remotePort} 销毁连接`)

                let index = this.clients.indexOf(client); // 找到当前client的index

                this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端
            })

            client.on('close', () => {
                console.log(`客户端 ${client.remoteAddress.substr(7, client.remoteAddress.length)}:${client.remotePort} 断开连接`)

                // let index = this.clients.indexOf(client); // 找到当前client的index

                // this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端
                this.clients = []

                client.destroy()
            })

            client.on('error', error => {
                console.log(`客户端 ${client.remoteAddress.substr(7, client.remoteAddress.length)}:${client.remotePort} 连接出错`)

                this.clients = []

                // let index = this.clients.indexOf(client); // 找到当前client的index

                // this.clients.splice(index, 1); // 此客户端已断开连接 数组中移除此客户端

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
        // let client = {}
        // this.clients = this.clients.map((v, i) => {

        // })
        return this.clients
    }

}

module.exports = TcpServer.getInstance()
