'use strict'

const constants = require('./constants')
const crypto    = require('crypto')
const bigInt    = require('big-integer')
const bitcoin   = require('bitcoinjs-lib')
const fs        = require('fs')

const keysFile  = fs.createWriteStream(`./${Date.now()}.txt`, { flags: 'a' })

function isPrime(number) {
    return bigInt(number).isPrime()
}

async function fistPrimeWithLength(length, numbers = constants.digitsOfE) {
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

function stringToBinary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

function valueToBase58(value) {
    let encoded = '';

	while (value.compareTo(0)){
		let division = value.divmod(58);
		
		value = division.quotient

		encoded = constants.alphabet.base58[division.remainder].concat(encoded);
	}

	return encoded
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
    return BigInt(`0x${hex}`).toString(10)
}

function checkValueAgainstAddress(number, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    const hex = padding(valueToHex(number))

    //console.log(`Hex ${hex} Length: ${hex.length}`)

    return checkHexAgainstAddress(hex, bounty)
}

function checkHexAgainstAddress(hex, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    hex = padding(hex)

    let keys = generateKeys(hex)

    keysFile.write(`Compressed: \n\tAddress: ${keys.compressed.address}\n\tPubKey: ${keys.compressed.public}\n\tPrivKey: ${keys.compressed.private}\n`)
    keysFile.write(`Uncompressed: \n\tAddress: ${keys.uncompressed.address}\n\tPubKey: ${keys.uncompressed.public}\n\tPrivKey: ${keys.uncompressed.private}\n`)

    //console.log(`Compressed: \n\tAddress: ${keys.compressed.address}\n\tPubKey: ${keys.compressed.public}\n\tPrivKey: ${keys.compressed.private}`)
    //console.log(`Uncompressed: \n\tAddress: ${keys.uncompressed.address}\n\tPubKey: ${keys.uncompressed.public}\n\tPrivKey: ${keys.uncompressed.private}`)
    if (keys.compressed.address == bounty.compressed || keys.uncompressed.address == bounty.uncompressed) {
        keysFile.write('---------------- FOUND!! ----------------')
        return true
    } else {
        let addresses = getFromBIP32(hex)

        keysFile.write(`BIP32:\n\tKeys: ${addresses.join(',')}\n`)
        /*console.log(`BIP32: `)
        console.log(`\tKeys: ${addresses.join(',')}\n`)*/
        let addressesFiltered = addresses.filter((v) => v == bounty.compressed || v == bounty.uncompressed)
        
        if (addressesFiltered.length > 0) {
            keysFile.write('---------------- FOUND!! ----------------')
            return true
        }
    }

    return false
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
    crypto.pbkdf2(secret, salt, 1000, 64, 'sha256', (err, derivedKey) => {
        return checkHexAgainstAddress(derivedKey.toString('hex'), { compressed: '1CHUUuEGv49ADj6vXRwf6ScCPg2pfDPivd' })
    })
}

function sha256Encrytp(encrypt, prime = '957496696762772407663' ) {
    return  checkHexAgainstAddress(crypto.createHash('sha256').update(encrypt.concat(prime)).digest('hex')) ||
            checkHexAgainstAddress(crypto.createHash('sha256').update(prime.concat(encrypt)).digest('hex'))
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

    return addresses
}

function checkPossibilities(bignum, prime = bigInt(957496696762772407663n)) {
    const possibilites = {
        asVal: [ bigInt(`${bignum}${prime}`), bigInt(`${prime}${bignum}`), prime.add(bignum), prime.multiply(bignum) ],
        asHex: [ `${valueToHex(prime)}${valueToHex(bignum)}`, `${valueToHex(bignum)}${valueToHex(prime)}`]
    }

    let found = checkPossibilitiesAsValue(possibilites.asVal)

    if (!found) {
        found = checkPossibilitiesAsHex(possibilites.asHex)
        keysFile.write('\n')
    }
        

    return found
}

function checkPossibilitiesAsValue(possibilites) {
    for (let index = 0; index < possibilites.length; index++) {
        let possibility = possibilites[index]

        keysFile.write(`Checking combination ${possibility}\n`)
        //console.log(`Checking combination ${possibility}`, () => {})

        return checkValueAgainstAddress(possibility) || sha256Encrytp(possibility.toString())
    } 
}

function checkPossibilitiesAsHex(possibilites) {
    for (let index = 0; index < possibilites.length; index++) {
        let possibility = possibilites[index]

        return checkHexAgainstAddress(possibility)
    } 
}

function checkPossibilitiesAsText(possibilites) {
    for (let index = 0; index < possibilites.length; index++) {
        let possibility = possibilites[index]

        return deriveKey(possibility)
    } 
}

module.exports = { isPrime, deriveKey, sha256Encrytp, numbersWithLength, fistPrimeWithLength, stringToBase56, stringToBinary, stringToBase58, valueToBase58, valueToHex, 
    hexToValue, concatValue, checkValueAgainstAddress, checkHexAgainstAddress, checkPossibilities }