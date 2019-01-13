const ec = new require('elliptic').ec('secp256k1');

class Utils
{
	static genKeys()
	{
		return ec.genKeyPair();
	}
}

module.exports = Utils;
