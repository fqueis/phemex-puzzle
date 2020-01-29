'use strict'

const constants = require('./constants')
const bigInt    = require('big-integer')
const utils     = require('./utils')
const g         = require('generatorics')

async function start() {
    const base58 = {
        hardCoded: {
            btc: bigInt(102611),
            xrp: bigInt(302422),
            eth: bigInt(132616),
            pheme: bigInt(2240374437),
            pheme_mex: bigInt(2240374437).add(201330),
            phemex: bigInt(224037443755)
        },
        converted: {
            btc: utils.stringToBase58('BTC'),
            xrp: utils.stringToBase58('XRP'),
            eth: utils.stringToBase58('ETH'),
            pheme: utils.stringToBase58('Pheme'),
            pheme_mex: utils.stringToBase58('Pheme').add(utils.stringToBase58('MEX')),
            phemex: utils.stringToBase58('Phemex')
        }
    }

    console.log(base58.converted.btc)

    console.log(`${base58.hardCoded.btc} + ${base58.hardCoded.eth} + ${base58.hardCoded.xrp} = ${base58.hardCoded.phemex}`)
    console.log(`${base58.hardCoded.btc.pow(2).multiply(base58.hardCoded.eth).multiply(base58.hardCoded.xrp)} = ${base58.hardCoded.phemex}`)

}

start()