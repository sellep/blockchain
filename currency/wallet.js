const Utils = require('../utils');

class Wallet
{
	constructor(balance)
	{
		this.balance = balance;
		this.keyPair = Utils.genKeys();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}
}

module.exports = Wallet;
