'use strict'

const bigInt = require('big-integer')
const bitcoin = require('bitcoinjs-lib')

function generateKeys(hex) {
    return { compressed: genKeyDetails(hex, true), uncompressed: genKeyDetails(hex, false) }
}

function genKeyDetails(hex, compressed = true) {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(hex, 'hex'), { compressed: compressed })
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

    const pu = keyPair.publicKey.toString('hex'), pv = keyPair.toWIF()

    return { address: address, public: pu, private: pv  }
}

let array = [29,
    11,
    10,
    14, 
    10,
    14,
    3,
    10,
    52,
    73,
    96,
    53,
    41,
    77,
    94,
    57,
    42, 
    45,
    45,
    14,
    14,
    32,
    27,
    10,
    21,
    11,
    21]

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

console.log(array.filter(onlyUnique))

//console.log(generateKeys('0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D'))