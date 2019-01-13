const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const uuid = require('uuid/v1');

class Utils
{
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
