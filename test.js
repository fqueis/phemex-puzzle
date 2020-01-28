'use strict'

const bigInt = require('big-integer')
const bitcoin = require('bitcoinjs-lib')
const utils = require('./utils')

function generateKeys(hex) {
    return { compressed: genKeyDetails(hex, true), uncompressed: genKeyDetails(hex, false) }
}

function genKeyDetails(hex, compressed = true) {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(hex, 'hex'), { compressed: compressed })
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

    const pu = keyPair.publicKey.toString('hex'), pv = keyPair.toWIF()

    return { address: address, public: pu, private: pv  }
}

utils.sha256Encrytp('how much wood could a woodchuck chuck if a woodchuck could chuck wood')