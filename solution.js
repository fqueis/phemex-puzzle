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
            btc: BigInt(102611),
            xrp: BigInt(302422),
            eth: bigInt(132616),
            pheme: bigInt(2240374437),
            phemex: bigInt(224037443755)
        },
        converted: {
            blockchain: utils.stringToBase58('BlockChain'),
            ethereum: utils.stringToBase58('Ethereum'),
            ripple: utils.stringToBase58('Ripple'),
            btc: utils.stringToBase58('BTC'),
            xrp: utils.stringToBase58('XRP'),
            eth: utils.stringToBase58('ETH'),
            pheme: utils.stringToBase58('Pheme'),
            phemex: utils.stringToBase58('Phemex')
        }
    }

    console.log(String(bigInt(669921875).multiply(bigInt(105154048).multiply(250047000))).length)
    

    //console.log(utils.sha256Encrytp('BTC'))

    //console.log(`${base58.converted.btc}${base58.converted.eth}${base58.converted.xrp} ${base58.converted.pheme}`)
    /*for (const permute of g.permutation([vIn, btc, xrp, eth])) {
        let number = bigInt(permute.join('')), bignum = pheme.multiply(number)

        //console.log(`${number} ${number.toString().length} ${bignum} ${bignum.toString().length}`)
        //console.log(bignum, String(bignum).length)
        //if (String(bignum).length == 27)
            //checkPossibilities(bignum)
    } */

    function checkPossibilities(bignum, prime = bigInt(957496696762772407663)) {
        const possibilites = {
            inVal: [ bigInt(`${bignum}${prime}`), bigInt(`${prime}${bignum}`), prime.add(bignum), prime.multiply(bignum) ],
            inHex: [ `${utils.valueToHex(prime)}${utils.valueToHex(bignum)}`, `${utils.valueToHex(bignum)}${utils.valueToHex(prime)}`],
        }

        possibilites.inVal.forEach(val => { 
            utils.checkValueAgainstAddress(val)
            utils.checkValueAgainstAddress(val, true)
            utils.sha256Encrytp(val.toString().concat(prime))
            utils.sha256Encrytp(String(prime).concat(val.toString()))
        });

        possibilites.inHex.forEach(hex => {
            utils.checkHexAgainstAddress(hex)
            utils.checkHexAgainstAddress(hex, true)
        })
    }
}

start().catch((err) => console.log(err))