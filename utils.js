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

function fistPrimeWithLength(length, numbers = constants.digitsOfE) {
    for (let index = 0; index < numbers.length - length; index++) {
        let number = numbers.slice(index, index + length), found = isPrime(number)

        if (found) return bigInt(number)
    }
}

function primeFactorsOf(prime = bigInt(957496696762772407663n)) {
    let primeFactors = [], divisor = bigInt(2)

    while (prime.mod(divisor).compareTo(bigInt.zero) == 0) {
        primeFactors.push(divisor);
        prime = prime.divide(divisor)
    }

    let sqrt = Math.sqrt(prime)

    for (let index = 3; index <= sqrt; index++){
        while (prime.mod(index) === 0) {
            primeFactors.push(index)
            prime = prime.divide(index)
        }
    }

    if (prime.compareTo(divisor) >= 1)
        primeFactors.push(prime)

    return primeFactors.filter((element, position) => primeFactors.indexOf(element) == position)
}

// TODO: FIX!
async function primitiveRootOf(prime = bigInt(957496696762772407663n)) {
    let phi = prime.subtract(bigInt.one)

    const primeFactors = await primeFactorsOf(phi)
    
    for (let index = bigInt(2); index <= phi; index = index.add(bigInt.one)) {
        let flag = false

        console.log(primeFactors)

        for (let r = 2; r < primeFactors.length; r++) {
            const primeFactor = primeFactors[r];

            let pResult = await power(bigInt(r), phi.divide(primeFactor), prime)

            if (pResult.compareTo(bigInt.one) == 0) {
                flag = true
                break
            }
        }
    }

    return bigInt.minusOne
}

async function power(x, y, p) {
    let result = bigInt.one

    x = x.mod(p)

    while (y.compareTo(bigInt.zero) == 1) {
        if (y.mod(2) == 1)
            result = result.multiply(x).mod(p)

        y = y.divide(bigInt(2))
        x = (x.multiply(x)).mod(p)
    }

    return result
}

function diffieHellman(prime, a, b, g = bigInt(5)) {
    let me = g.pow(a).mod(prime), phemex = g.pow(b).mod(prime)

    return phemex.pow(a).mod(prime)
}

function numbersWithLength(length, numbers) {
    let numbersArray = []
    
    for (let index = 0; index < numbers.length - length; index++)
        numbersArray.push(numbers.slice(index, index + length))

    return numbersArray
}

function stringToBase56(string) {
    let decoded = bigInt();

	while (string){
		decoded = decoded.multiply(56).add(constants.alphabet.base58.indexOf(string[0]))

		string = string.substring(1);
	}

	return decoded;
}

function stringToBase58(string, alphabet = constants.alphabet.base58.btc) {
    let decoded = bigInt(0);

	while (string){
        decoded = decoded.multiply(58).add(alphabet.indexOf(string[0]))

		string = string.substring(1);
	}

	return decoded;
}

function reversedStringToBase58(string) {
    string = string.split('').reverse().join('')

    return stringToBase58(string)
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

    if (hex.length < 10)
        hex = '0'.concat(hex)

	return hex.toUpperCase()
}

function hexToValue(hex) {
    return BigInt(`0x${hex}`).toString(10)
}

function toLittleEndian(string) {
    let len = string.length, littleEndianString = ""

    for(let i = 0; i < len/2; i++)
        littleEndianString += string.substring((len-((i+1)*2)),(len-(i*2)))

    return littleEndianString
}

function toBigEndian(string) {
    let len = string.length, bigEndianHexString = "";

    for(let i = 0; i < len/2; i++)
        bigEndianHexString += string.substring((len-(i*2)), (len-((i+1)*2)))

    return parseInt(bigEndianHexString)
}

function checkValueAgainstAddress(number, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    const hex = padding(valueToHex(number))

    return checkHexAgainstAddress(hex, bounty)
}

function checkHexAgainstAddress(hex, bounty = { compressed: '1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT', uncompressed: '1LPmwxe59KD6oEJGYinx7Li1oCSRPCSNDY' }) {
    hex = padding(hex)

    let keys = generateKeys(hex)

    keysFile.write(`Compressed: \n\tAddress: ${keys.compressed.address}\n\tPubKey: ${keys.compressed.public}\n\tPrivKey: ${keys.compressed.private}\n`)
    keysFile.write(`Uncompressed: \n\tAddress: ${keys.uncompressed.address}\n\tPubKey: ${keys.uncompressed.public}\n\tPrivKey: ${keys.uncompressed.private}\n`)

    if (keys.compressed.address == bounty.compressed || keys.uncompressed.address == bounty.uncompressed) {
        keysFile.write('---------------- FOUND!! ----------------')
        return true
    } else {
        let addresses = getFromBIP32(hex)

        keysFile.write(`BIP32:\n\tKeys: ${addresses.join(',')}\n`)
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

function hash256(encrypt ) {
    return checkHexAgainstAddress(crypto.createHash('sha256').update(encrypt).digest('hex'))
}

function doubleHash256(toHash) {
    return checkHexAgainstAddress(crypto.createHash('sha256').update(crypto.createHash('sha256').update(toHash).digest()).digest('hex'))
}

function getFromBIP32(hex) {
    const root = bitcoin.bip32.fromSeed(Buffer.from(hex, 'hex'))

    let addresses = []
    for (let index = 0; index < 5; index++) {
        const path = `m/0'/0'/${index}'`
        const child = root.derivePath(path)

        const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });

        addresses.push(address)
    }

    return addresses
}

function checkPossibilities(bignum, prime = bigInt(957496696762772407663n)) {
    const possibilites = {
        asVal: [ 
            bigInt(`${bignum}${prime}`), 
            bigInt(`${prime}${bignum}`), 
            prime.add(bignum), 
            prime.multiply(bignum), 
            bigInt(`${prime}${bignum}${bignum}`), 
            bigInt(`${prime}${bignum.multiply(bignum)}`),
            bigInt(`${bignum.multiply(bignum)}${prime}`)
        ],
        asHex: [ `${valueToHex(prime)}${valueToHex(bignum)}`, `${valueToHex(bignum)}${valueToHex(prime)}` ]
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

        return checkValueAgainstAddress(possibility) || hash256(possibility.toString()) || doubleHash256(possibility.toString())
    } 
}

function checkPossibilitiesAsHex(possibilites) {
    for (let index = 0; index < possibilites.length; index++) {
        let possibility = possibilites[index]

        return checkHexAgainstAddress(possibility)
    } 
}

module.exports = { 
    isPrime, hash256, numbersWithLength, fistPrimeWithLength, stringToBase56, stringToBinary, diffieHellman,
    reversedStringToBase58, stringToBase58, valueToBase58, valueToHex, toLittleEndian, toBigEndian,
    hexToValue, concatValue, checkValueAgainstAddress, checkHexAgainstAddress, checkPossibilities }