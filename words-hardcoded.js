'use strict'

const utils     = require('./utils')
const bigInt    = require('big-integer')
const g         = require('generatorics')

async function start() {
    const base58 = {
        first: '1441495051',
        TwentyOne: '1',
        digit: '3641394151',
        prime: '4749414437',
        found: '3846524536',
        in: '4145',
        consecutive: '3546455037355251415337',
        digits: '364139415150',
        e: '37'
    }, btc = bigInt(102611), eth = bigInt(132616), xrp = bigInt(302422)

    let bs58Decoded = Object.values(base58)

    bs58Decoded.push(btc.toString(), btc.multiply(2).toString(), btc.pow(2).toString(), '215483', '33381606403')
    bs58Decoded.push(btc.add(eth).add(xrp), btc.multiply(eth).multiply(xrp))
    bs58Decoded.push('650521',  '33382041441') // btc*2.1+eth+xrp btc^2.1+eth+xrp
    bs58Decoded.push('8642160325724816',  '1338802571269975280656') // btc*2.1*eth*eth btc^2.1*eth*xrp
    bs58Decoded.push(btc.multiply(2).add(eth).add(xrp), btc.pow(2).add(eth).add(xrp))
    bs58Decoded.push(btc.multiply(2).multiply(eth).multiply(xrp), btc.pow(2).multiply(eth).multiply(xrp))

    for (const permute of g.powerSet(bs58Decoded)) {
        let number = permute.join('')

        if (number.length == 27) {
            let found = utils.checkPossibilities(bigInt(number))

            if (found) break
        }
    }
}

start()