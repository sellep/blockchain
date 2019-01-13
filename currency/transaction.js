const Utils = require('../utils');

class Transaction
{
	constructor()
	{
		this.id = Utils.id();
		this.input = null;
		this.output = [];
	}

	update(sender, recipient, amount)
	{
		const out = this.output.find(o => o.address === sender.publicKey);

		if (amount > out.amount)
		{
			console.log('insufficient amount');
			return;
		}

		out.amount -= amount;

		this.output.push({ amount, address: recipient});

		Transaction.sign(this, sender);

		return this;
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
