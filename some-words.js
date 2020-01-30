'use strict'

const utils     = require('./utils')
const bigInt    = require('big-integer')
const constants = require('./constants')
const g         = require('generatorics')

async function start() {
    let btc = utils.reversedStringToBase58('BTC'), words = constants.words.split(' '), eth = utils.reversedStringToBase58('ETH'), xrp = utils.reversedStringToBase58('XRP')

    let bs58Decoded = []
    for (let index = 0; index < words.length; index++)
        bs58Decoded.push(utils.stringToBase58(words[index]).toString())

    // 73833 = BTC*2.1 | 3521086384 = BTC^2.1
    bs58Decoded.push(utils.stringToBase58('Phemex'), utils.reversedStringToBase58('Phemex'))
    bs58Decoded.push(btc.toString(), btc.multiply(2).toString(), btc.pow(2).toString(), '73833', '3521086384')
    bs58Decoded.push(btc.add(eth).add(xrp), btc.multiply(eth).multiply(xrp))
    bs58Decoded.push(btc.multiply(2).add(eth).add(xrp), btc.pow(2).add(eth).add(xrp))
    bs58Decoded.push(btc.multiply(2).multiply(eth).multiply(xrp), btc.pow(2).multiply(eth).multiply(xrp))
    bs58Decoded.push(bigInt(73833).add(eth).add(xrp), bigInt(3521086384).add(eth).add(xrp))
    bs58Decoded.push(bigInt(73833).multiply(eth).multiply(xrp), bigInt(3521086384).multiply(eth).multiply(xrp))

    for (const permute of g.powerSet(bs58Decoded)) {
        let number = permute.join('')

        if (number.length == 27) {
            let found = utils.checkPossibilities(bigInt(number))

            if (found) break
        }
    }
}

start()