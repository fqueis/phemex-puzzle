'use strict'

const bigInt    = require('big-integer')
const utils     = require('./utils')
const fs        = require('fs')  
const lineReader = require('line-reader')

async function start() {
    const possibilities = {
        B: [3,8,3,6,7,3,6,7,8,5],
        T: [7,7,8,8,8,8,7,8,7,8],
        C: [5,3,6,4,4,6,3,6,5,6],
        X: [6,4,5,3,3,7,4,5,6,7],
        R: [8,6,7,7,6,5,8,3,3,3],
        P: [0,0,0,0,0,0,0,0,0,0],
        E: [4,5,4,5,5,4,5,4,4,4],
        H: [2,2,1,1,1,2,2,1,2,2],
        M: [1,1,2,2,2,1,1,2,1,1]
    }

    for (let index = 0; index < 10; index++) {
        let btc = bigInt(`${possibilities.B[index]}${possibilities.T[index]}${possibilities.C[index]}`),
            eth = bigInt(`${possibilities.E[index]}${possibilities.T[index]}${possibilities.H[index]}`),
            xrp = bigInt(`${possibilities.X[index]}${possibilities.R[index]}${possibilities.P[index]}`)

        let concated = bigInt(`${btc.pow(3)}${eth.pow(3)}${xrp.pow(3)}`)

        utils.checkPossibilities(concated)
    }
}

start()