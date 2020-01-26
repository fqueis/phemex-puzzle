const bs58      = require('bs58')
const bs58Chk   = require('bs58check')
const bitcore   = require('bitcore-lib')

const values    = [BigInt(957496696762772407663), "Phemex", "BTC", "XRP", "ETH"],
        b58     = ["A685A77A7873883518774", 224037443755, 102611, 302422, 132616]

const constants = {
    PRIME: {
        value: 957496696762772407663,
        base58: "A685A77A7873883518774"
    },
    PHEMEX: {
        value: "Phemex",
        base58: 224037443755
    },
    BTC: {
        value: "BTC",
        base58: 102611
    },
    XRP: {
        value: "XRP",
        base58: 302422
    },
    ETH: {
        value: "ETH",
        base58: 132616
    }
}
/*
    Privs: 
        5ocqj7h9kgeETQHdtZwxKdKwB4HSw3qwTfzDo6gWGhMFQEDEE58yPGXcUKV
        5ocqj7h9kgeETQHdtZwxKdKwB4HSwDvV8GVzfvuyzdy2gikjcCBhe2LKLWf

*/
async function start() {
    const encoded   = `${constants.PRIME.base58}${constants.XRP.base58}${constants.BTC.value}${constants.PHEMEX.value}${constants.ETH.value}`
        //,in_hex      = Buffer.from(encoded, 'utf-8').toString('hex')

    /*const pubkey = "1h8BNZkhsPiu6EKazP19WkGxDw3jHf9aT"

    const decoded = bs58.decode(pubkey)
    const back = bs58.encode(decoded)

    console.log(decoded, back) */

    const privkey = "5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF"
    const decoded = bs58.decode(privkey)
    const back = bs58.encode(decoded)

    console.log(decoded, back)

 
    const bytes = Buffer.from(encoded)//, address = bs58.encode(bytes)

    console.log(bs58Chk.encode(bytes))
}

function combine(left, right) {

    function carry() {
        return c.reduceRight(function (r, _, i, o) {
            return r && !(o[i] = (o[i] + 1) % left.length);
        }, 1);
    }

    var c = Array.apply(null, { length: right.length }).map(function () { return 0; }),
        result = [];

    do {
        result.push(c.reduce(function (r, a, i) {
            r[left[a]].push(right[i]);
            return r;
        }, left.reduce(function (r, a) {
            r[a] = [];
            return r;
        }, {})));
    } while (!carry());
    return result;
}

start()