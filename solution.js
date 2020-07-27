'use strict'

const constants = require('./constants')
const utils     = require('./utils')

function start() {
    let prime = utils.fistPrimeWithLength(21) // 957496696762772407663
    
    let satoshi = utils.stringToBase58('SatoshiNakamoto') // 124728751148945267645137860
    satoshi = utils.valueToHex(satoshi) // 672C5725FA8FC1AA52C3C4
    satoshi = utils.toLittleEndian(satoshi) // C4C352AAC18FFA25572C67
    satoshi = utils.hexToValue(satoshi) // 237871847045914904726285415

    let phemex = utils.stringToBase58('Phemex', constants.alphabet.base58.xrp) // 14481167745
    phemex = utils.valueToHex(phemex) // 35F251581
    phemex = utils.toLittleEndian(phemex) // 8115255F03
    phemex = utils.hexToValue(phemex) // 554405551875

    let big = prime.multiply(satoshi).multiply(phemex) // 126272244427365764086102017718794198001099243823071433146875
    big = utils.valueToHex(big) // 141DC7BEC50472BB381BE8E18F6D6B397773D71FC5D91D41FB

    utils.checkHexAgainstAddress(big)

    /**
        Compressed: 
            Address: 1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT
            PubKey: 02b4a72e4aaa69ba04b80c6891df01f50d191a65eccc61e4e9862d1e421ce815b3
            PrivKey: KwDiBf89QgGfm2CrqioD77Q1g7urAhFcGUyUCQP3GdGAwCQRszmY
        Uncompressed: 
            Address: 1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY
            PubKey: 04b4a72e4aaa69ba04b80c6891df01f50d191a65eccc61e4e9862d1e421ce815b3ab901d841b04677e00d5b314722a8e2d1ca14f13937a8d7e21a613365ef4f250
            PrivKey: 5HpHagT65Ta1AyThkDBvVaAkCajnaTnuPzYNZwgtGKdyB6AQznZ
            ---------------- FOUND!! ----------------
     */
}

start()