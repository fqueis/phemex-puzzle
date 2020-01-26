'use strict'

const constants = require('./constants')
const crypto    = require('crypto')
const bigInt    = require('big-integer')
const bitcoin   = require('bitcoinjs-lib')

function isPrime(number) {
    return bigInt(number).isPrime()
}

async function fistPrimeWithLength(length, numbers) {
    for (let index = 0; index < numbers.length - length; index++) {
        let number = numbers.slice(index, index + length), found = isPrime(number)

        if (found) return Promise.resolve(bigInt(number))
    }
}

async function numbersWithLength(length, numbers) {
    let numbersArray = []
    
    for (let index = 0; index < numbers.length - length; index++)
        numbersArray.push(numbers.slice(index, index + length))

    return Promise.resolve(numbersArray)
}

function stringToBase56(string) {
    let decoded = bigInt();

	while (string){
		decoded = decoded.multiply(56).add(constants.alphabet.base58.indexOf(string[0]))

		string = string.substring(1);
	}

	return decoded;
}

function stringToBase58(string) {
	let decoded = bigInt();

	while (string){
		decoded = decoded.multiply(58).add(constants.alphabet.base58.indexOf(string[0]))

		string = string.substring(1);
	}

	return decoded;
}

function valueToBase58(value) {
    let encoded = '';

	while (value.compareTo(0)){
		let division = value.divmod(58);
		
		value = division.quotient

		encoded = constants.alphabet.base58[division.remainder].concat(encoded);
	}

	return encoded//'1' + encoded;
}

function valueToHex(value) {
    let hex = '';

	while (value.compareTo(0)){
		let division = value.divmod(16);
		
		value = division.quotient

		hex = constants.alphabet.hex[division.remainder].concat(hex);
    }

	return hex.toUpperCase()
}

function hexToValue(hex) {
    let decoded = bigInt()

    while (hex){
		decoded = decoded.multiply(16).add(constants.alphabet.hex.indexOf(hex[0]))

		hex = hex.substring(1);
	}

	return decoded;
}

async function checkValueAgainstAddress(number, bip32 = false, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    const hex = padding(valueToHex(number))

    //console.log(`Hex ${hex} Length: ${hex.length}`)

    checkHexAgainstAddress(hex, bip32, bounty)
}

async function checkHexAgainstAddress(hex, bip32 = false, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    hex = padding(hex)

    if (bip32) {
        let addresses = getFromBIP32(hex)

        let addressesFiltered = addresses.filter((v) => v == bounty.compressed || v == bounty.uncompressed)
        
        if (addressesFiltered.length > 0) {
            console.log('Found')
            console.log(addresses)
            return addresses
        }
            
    } else {
        let keys = generateKeys(hex)

        //console.log(keys)
        if (keys.compressed.address == bounty.compressed || keys.uncompressed.address == bounty.uncompressed) {
            console.log('Found!')
            console.log(keys)
        }
    }
}

function generateKeys(hex) {
    return { compressed: genKeyDetails(hex, true), uncompressed: genKeyDetails(hex, false) }
}

function genKeyDetails(hex, compressed = true) {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(hex, 'hex'), { compressed: compressed })
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

    const pu = keyPair.publicKey.toString('hex'), pv = keyPair.toWIF()

    return { address: address, public: pu, private: pv  }
}

function padding(bigIntegerHexString) {
    let string = bigIntegerHexString
    
	while (string.length < 64)
        string = '0' + string
        
	if (64 < string.length)
        string = string.substring(string.length-64)

	return string; 
}

function concatValue(...number) {
    let concat = number.reduce((acc, curr) => acc.concat(curr.toString()) , '')

    return {
        value: concat,
        reversed: function reverse() {
            return concat.split('').reverse().join('')
        }
    }
}

function deriveKey(secret, salt = 'Phemex') {
    crypto.pbkdf2(secret, salt, 21, 64, 'sha256', (err, derivedKey) => {
        if (!err)
            checkHexAgainstAddress(derivedKey.toString('hex'))
    })
}

function sha256Encrytp(toEncrypt) {
    let prime = 'A685A77A7873883518774', update = prime.concat(toEncrypt)

    console.log(toEncrypt)
    let hex = crypto.createHash('sha256').update(toEncrypt)
        //hex = crypto.createHash('sha256').update(toEncrypt).digest('hex')
    console.log(hex)
    //testHexAgainstAddress(hex)
}

function getAddress(node) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey });
}

function getFromBIP32(hex) {
    const root = bitcoin.bip32.fromSeed(Buffer.from(hex, 'hex'))

    let addresses = []
    for (let index = 0; index < 5; index++) {
        const path = `m/0'/0'/${index}'`
        const child = root.derivePath(path)

        const { address } = getAddress(child)

        addresses.push(address)
    }

    //console.log(hex, addresses)

    return addresses
}

module.exports = { isPrime, deriveKey, sha256Encrytp, numbersWithLength, fistPrimeWithLength, stringToBase56, stringToBase58, valueToBase58, valueToHex, hexToValue, concatValue, checkValueAgainstAddress, checkHexAgainstAddress }