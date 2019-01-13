const Transaction = require('./transaction');

class TransactionPool
{

	constructor()
	{
		this.transactions = [];
	}

	updateOrAdd(transaction)
	{
		const idx = this.transactions.findIndex(t => t.id === transaction.id);

		if (idx >= 0)
		{
			this.transactions[idx] = transaction;
		}
		else
		{
			this.transactions.push(transaction);
		}
	}
}

module.exports = TransactionPool;

