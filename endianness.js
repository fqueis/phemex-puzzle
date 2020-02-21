'use strict'

const os = require('os')
const bs58 = require('bs58')

function start() {
    console.log(os.endianness())

    const eth = bs58.decode('ETH').toString('hex'), btc = bs58.decode('BTC').toString('hex'), xrp = bs58.decode('XRP').toString('hex'), 
        phemex = bs58.decode('Phemex').toString('hex')

    console.log(eth, btc, xrp, phemex)

    function littleEndianToDecimal(string) {
        let len = string.length, bigEndianHexString = "0x";
        
        for(let i = 0; i < len/2; i++)
            bigEndianHexString += string.substring((len-((i+1)*2)),(len-(i*2)))

        return parseInt(bigEndianHexString);
    }

    function bigEndianToDecimal(string) {
        let len = string.length, bigEndianHexString = "0x";
        
        for(let i = 0; i < len/2; i++)
            bigEndianHexString += string.substring((len-(i*2)), (len-((i+1)*2)))

        return parseInt(bigEndianHexString);
    }

    console.log(bigEndianToDecimal(eth), littleEndianToDecimal(eth))
}

start()