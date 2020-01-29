'use strict'

const constants = require('./constants')
const bigInt    = require('big-integer')
const utils     = require('./utils')
const g         = require('generatorics')

async function start() {
    let prime = await utils.fistPrimeWithLength(21, constants.digitsOfE)

    let decrypted = {
        base56: {
            phemex: utils.stringToBase56('Phemex'),
            xrp: utils.stringToBase56('XRP'),
            eth: utils.stringToBase56('ETH'),
            btc: utils.stringToBase56('BTC')
        },
        base58: {
            phemex: utils.stringToBase58('Phemex'),
            xrp: utils.stringToBase58('XRP'),
            eth: utils.stringToBase58('ETH'),
            btc: utils.stringToBase58('BTC')
        }
    }

    //console.log(xrp.multiply(firstPrime))

    // ASCII SEM 1/0
    // Phemex = 8492

    // Btcn = 66699
    // Rpple = 8222811
    // Ethereum = 6964479

    // BTC = 668467
    // XRP = 88828
    // ETH = 698472

    // Bitcoin = 6656995
    // Ripple = 825228
    // Ethereum = 6964479

    // ASCII

    // Pheme = 80104101109101120
    // BTC = 668467
    // ETH = 698472
    // XRP = 888280
    
    /*let symbol = 'Phemex' 
    console.log(symbol.length)
    for (let index = 0; index < symbol.length; index++) {
        let charCode = symbol.charCodeAt(index)
        let char = String.fromCharCode(charCode)
        console.log(char, charCode)
    } */

    // C = P² mod n
    // P = BTC mod n 
    // n = pub key decimal

    // Maybe solution??
    /*let pubkeydec = bigInt(329683138593478325549302074633686094149904366152930177420927302574687641966842n)

    let encrypted = {
        eth: eth.square(2).mod(pubkeydec),
        btc: btc.square(2).mod(pubkeydec),
        xrp: xrp.square(2).mod(pubkeydec),
        phemex: phemex.square(2).mod(pubkeydec)
    }
    console.log(encrypted)
    
    let bignum = encrypted.eth.add(encrypted.btc).add(encrypted.xrp)
    console.log(bignum, String(bignum).length)

    let concated = bigInt(bignum.toString().concat(firstPrime))
    
    utils.sha256Encrytp(String(phemex.multiply(concated))) */

    const base58 = {
        hardCoded: {
            btc: bigInt(102611),
            xrp: bigInt(302422),
            eth: bigInt(132616),
            pheme: bigInt(2240374437),
            pheme_mex: bigInt(2240374437).add(201330),
            phemex: bigInt(224037443755),
            found: bigInt(3846524536),
            in: bigInt(4145)
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

    let frase = `${base58.hardCoded.btc.pow(2)}${base58.hardCoded.found}${base58.hardCoded.in}`

    console.log(base58.converted.btc, frase, String(frase).length)

    /*console.log(base58.converted.btc, base58.converted.eth, base58.converted.xrp, base58.converted.phemex)

    for (const permute of g.permutation([base58.hardCoded.btc, base58.hardCoded.eth, base58.hardCoded.xrp])) {
        let number = bigInt(permute.join('')), bignum = base58.hardCoded.pheme_mex.multiply(number)

        console.log(`${number} ${number.toString().length} ${bignum} ${bignum.toString().length}`)
        console.log(bignum, String(bignum).length)
        if (String(bignum).length == 27)
            utils.checkPossibilities(bignum)
    } */
}

start().catch((err) => console.log(err))