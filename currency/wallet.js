const Utils = require('../utils');
const Transaction = require('./transaction');

class Wallet
{
	constructor(balance)
	{
		this.balance = balance;
		this.keyPair = Utils.genKeys();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}

	sign(hash)
	{
		return this.keyPair.sign(hash);
	}

	createTransaction(recipient, amount, pool)
	{
		let transaction = pool.find(this.publicKey);

		if (transaction)
		{
			transaction.update(this, recipient, amount);
		}
		else
		{
			transaction = Transaction.create(this, recipient, amount);
			pool.updateOrAdd(transaction);
		}

		return transaction;
	}
}

module.exports = Wallet;
