'use strict'

const utils = require('./utils')

async function start() {
    const binary = {
        btc: utils.stringToBinary('BTC'),
        eth: utils.stringToBinary('ETH'),
        xrp: utils.stringToBinary('XRP'),
        pheme: utils.stringToBinary('Pheme'),
        phemex: utils.stringToBinary('Phemex')
    }

    console.log(Buffer.from(binary.btc, 'ascii').toString('hex'))
}

start()