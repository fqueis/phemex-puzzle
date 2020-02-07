'use strict'

const constants = require('./constants')
const bigInt    = require('big-integer')
const utils     = require('./utils')
const bs58    = require('base58')
const g         = require('generatorics')

function start() {
    const btc   = utils.stringToBase58('BTC'), eth = utils.reversedStringToBase58('ETH'), 
        xrp = utils.stringToBase58('XRP'), phemex = utils.reversedStringToBase58('Phemex'), prime = utils.fistPrimeWithLength(21)

    console.log(btc, eth, xrp, btc, prime, phemex)
    console.log(btc.multiply(prime).add(eth).add(xrp))
}

start()