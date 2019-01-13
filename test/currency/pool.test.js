const TransactionPool = require('../../currency/pool');
const Transaction = require('../../currency/transaction');
const Wallet = require('../../currency/wallet');

describe('TransactionPool', () =>
{
	const sender = new Wallet(80);
	let pool, transaction;

	beforeEach(() =>
	{
		pool = new TransactionPool();
		transaction = Transaction.create(sender, 'recipient', 50);
		pool.updateOrAdd(transaction);
	});

	it('adds transaction to the pool', () =>
	{
		expect(pool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
	});

	it('updates a transaction', () =>
	{
		const old = JSON.stringify(transaction);

		transaction = transaction.update(sender, 'recipient 2', 10);
		pool.updateOrAdd(transaction);

		expect(JSON.stringify(pool.transactions.find(t => t.id === transaction.id))).not.toEqual(old);
	});
});
