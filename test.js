'use strict'

const bigInt    = require('big-integer')
const utils     = require('./utils')

function start() {
    const prime = utils.fistPrimeWithLength(21).toString()

    utils.sha256(prime.concat('XRPBTCxemehPHTE'))
}

start()