const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const uuid = require('uuid/v1');

class Utils
{
	static hash(data)
	{
		return SHA256(data).toString();
	}

	static verify(pub, sig, hash)
	{
		return ec.keyFromPublic(pub, 'hex').verify(hash, sig);
	}

	static genKeys()
	{
		return ec.genKeyPair();
	}

	static id()
	{
		return uuid();
	}
}

module.exports = Utils;
