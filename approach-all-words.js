'use strict'

const bigInt    = require('big-integer')
const constants = require('./constants')
const utils     = require('./utils')
const g         = require('generatorics')

async function start() {
    const prime = await utils.fistPrimeWithLength(21, constants.digitsOfE)

    for (const permute of g.baseN(['First', 'N'])) {
        let joined = permute.join('')

        console.log(`${joined}`)
    }

}

start()