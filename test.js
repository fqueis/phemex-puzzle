'use strict'

const bigInt    = require('big-integer')
const utils     = require('./utils')

function start() {
    const pheme = utils.stringToBase58('Pheme'), btc = utils.stringToBase58('BTC'), eth = utils.stringToBase58('ETH'), xrp = utils.stringToBase58('XRP')

    console.log(btc, btc.pow(2), eth, xrp, pheme)
    let sentence = pheme.multiply(btc.pow(2).multiply(eth).multiply(xrp))

    console.log(sentence, sentence.toString().length)
}

start()