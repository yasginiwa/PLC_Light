// 引入events模块
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
    //  单例模式
    static getInstance() {
        if (!MyEmitter.instance) {
            MyEmitter.instance = new MyEmitter()
        }
        return MyEmitter.instance
    }

  constructor(opt) {
    super(opt);
  }
}


module.exports = MyEmitter.getInstance()
