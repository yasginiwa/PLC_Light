module.exports = {
    db_config: {
        host: '127.0.0.1',
        user: 'root',
        password: 'yasginiwa',
        database: 'dbbin',
        port: 3306
    },
    jwt_config: {
        secretOrKey: 'yasginiwa12#$',
        expiresIn: 3600
    },
    baseURL: {
        private: '/api/v1/private',
        public: '/api/v1/public'
    },
    upload_config: {
        
    },
    weapp_config: {
        appid: 'wx6e12c795fe0e73c5',
        secret: '1efc00a55d22cc93edce26bc8561f194'
    },
    openSingleRelay: {
        ch0: '050000ff00',
        ch1: '050001ff00'
    },
    closeSingleRelay: {
        ch0: '0500000000',
        ch1: '0500010000'
    },
    openAllRelay: {
        ch_all: '0f0000000201ff'
    },
    closeAllRelay: {
        ch_all: '0f000000020100'
    },
    singleRelayStatus: {
        status: '0403e80014'
    }
}