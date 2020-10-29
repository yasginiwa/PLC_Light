const mysql = require('mysql')
const { db_config } = require('../config/default')

//  mysql连接 设计成单例模式
class Connect {
    static getInstance() {
        if (!Connect.instance) {
            Connect.instance = new Connect()
        }
        return Connect.instance
    }

    //  构造函数
    constructor() {
        this.mysql = mysql
        this.connection = this.mysql.createConnection(db_config)
        this.connection.connect(err => {
            if (err) {
                console.log('数据库连接失败')
                return
            }
            console.log(`数据库连接成功 连接id:${this.connection.threadId}`)
        })
    }

    //  将执行sql语句封装成promise
    execQuery(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.log(`sql:${sql} 执行失败`)
                    reject(error.message)
                } else {
                    console.log(`sql:${sql} 执行成功`)
                    resolve(results)
                }
            })
        })
    }

    //  执行事务语句封装成promise
    execTransaction(sqlArr) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((beginError, results) => {
                //  事务开启错误
                if (beginError) {
                    console.log(`${sqlArr} 事务提交失败 ${beginError}`)
                    reject(beginError)
                }
                //  执行sql语句错误
                for (let i = 0; i < sqlArr.length; i++) {
                    this.connection.query(sqlArr[i], (sqlError) => {
                        if (sqlError) {
                            return this.connection.rollback(() => {
                                console.log(`${sqlArr} 事务提交失败 ${sqlError}`)
                                reject(sqlError)
                            })
                            
                        }
                    })
                }

                //  事务提交错误
                this.connection.commit((commitError) => {
                    if (commitError) {
                        return this.connection.rollback(() => {
                            console.log(`${sqlArr} 事务提交失败 ${commitError}`)
                            reject(commitError)
                        })
                    }
                    console.log(`${sqlArr} 事务提交成功`)
                    resolve('Transaction success')
                })

            })

        })
    }
}

module.exports = Connect.getInstance()


