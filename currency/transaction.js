const Utils = require('../utils');

class Transaction
{
	constructor()
	{
		this.id = Utils.id();
		this.input = null;
		this.output = [];
	}

	static create(sender, recipient, amount)
	{
		let transaction;

		if (amount < 0)
		{
			console.log('amount cannot be negative');
			return;
		}

		if (amount > sender.balance)
		{
			console.log('insufficient amount');
			return;
		}

		transaction = new this();

		transaction.output.push(
		...[
			{
				amount: sender.balance - amount,
				address: sender.publicKey,

			},
			{
				amount: amount,
				address: recipient
			}
		]);

		Transaction.sign(transaction, sender);

		return transaction;
	}

	static sign(transaction, sender)
	{
		transaction.input =
		{
			timestamp: Date.now(),
			amount: sender.balance,
			address: sender.publicKey,
			signature: sender.sign(Utils.hash(JSON.stringify(transaction.output)))
		};
	}

	static verify(transaction)
	{
		return Utils.verify(transaction.input.address, transaction.input.signature, Utils.hash(JSON.stringify(transaction.output)));
	}
}

module.exports = Transaction;
