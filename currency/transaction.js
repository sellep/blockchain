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

		return transaction;
	}
}

module.exports = Transaction;
