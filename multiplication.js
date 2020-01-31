'use strict'

const constants     = require('./constants')
const utils         = require('./utils')
const bigInt        = require('big-integer')
const g             = require('generatorics')

async function start() {
    /*const words = constants.words.split(' '), */
    const prime = await utils.fistPrimeWithLength(21), btc = utils.stringToBase58('BTC')

    console.log(prime)
    // y² mod p = (x³ + ax + b) mod p
    let result = btc.pow(2).mod(prime)
    console.log(result)

    /*let bs58Decoded = []
    for (let index = 0; index < words.length; index++) {
        let word = words[index]

        bs58Decoded.push(utils.stringToBase58(word), utils.reversedStringToBase58(word))
    } */

    //let phemex = utils.stringToBase58('Phemex'), btc = utils.stringToBase58('BTC')

    /*for (const permute of g.baseN([btc.multiply(2), utils.stringToBase58('ETH'), utils.stringToBase58('XRP')])) {
        let number = bigInt(permute.join('')), bignum = phemex.multiply(number)

        if (bignum.toString().length == 27)
            utils.checkPossibilities(bignum)
    } */

    
    
}

start().catch((err) => console.log(err))