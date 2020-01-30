'use strict'

const constants = require('./constants')
const bigInt    = require('big-integer')
const utils     = require('./utils')
const bs58    = require('base58')
const g         = require('generatorics')

function start() {
    const btc = utils.reversedStringToBase58('BTC'), eth = utils.reversedStringToBase58('ETH'), xrp = utils.reversedStringToBase58('XRP'), phemex = utils.stringToBase58('Phemex')

    console.log(`${btc} ${btc.pow(2)} ${btc.multiply(2)}`)
    

    /*for (const permute of g.permutation([])) {
        let number = bigInt(permute.join(''))

        console.log(`${number} ${number.toString().length} ${bignum} ${bignum.toString().length}`)
        console.log(bignum, String(bignum).length)
        if (String(bignum).length == 27)
            utils.checkPossibilities(bignum)
    }*/
}

start()