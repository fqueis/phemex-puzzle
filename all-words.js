'use strict'

const bigInt    = require('big-integer')
const g         = require('generatorics')
const constants = require('./constants')
const utils     = require('./utils')

function start() {
    const words = constants.words.split(' ').map((w) => utils.stringToBase58(w))

    for (let perm of g.permutationCombination(words)) {
        let bignum = bigInt(perm.join(''))

        if (bignum.toString().length == 27)
            utils.checkPossibilities(bignum)
    }
}

start()