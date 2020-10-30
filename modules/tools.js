const bcrypt = require('bcrypt')
const Iconv = require('iconv').Iconv
const iconv = new Iconv('utf8', 'ISO-8859-1')

const tools = {

    //  密码加密
    enbcrypt(password) {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        return hash
    },

    //  比对密码密文
    comparePassword(textPlainPassword, hash) {
        return bcrypt.compareSync(textPlainPassword, hash)
    },

    //  数字十六进制转十进制
    hex2int(hex) {
        var len = hex.length, a = new Array(len), code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i)
            if (48 <= code && code < 58) {
                code -= 48
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code
        }

        return a.reduce(function (acc, c) {
            acc = 16 * acc + c
            return acc
        }, 0)
    },

    //  PLC指令重编码
    encodeInstruction(hexStr) {
        
        let instruction = ''
        let tempArr = []

        for (let i = 0; i < hexStr.length; i++) {
            let tempStr = hexStr.substring(i, 2 + i)
            tempArr.push(tempStr)
            tempStr = ''
            ++i
        }

        let instructionArr = tempArr.map(v => {
            return String.fromCharCode(tools.hex2int(v))
        })


        instructionArr.forEach(v => instruction += v)

        return iconv.convert(instruction)
    },

    //  PLC心跳接受结果转码
    decodeKeepAlive(data) {
        return data.toString().slice(3, -2)
    }
}

module.exports = tools
