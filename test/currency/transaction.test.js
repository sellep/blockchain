const Wallet = require('../../currency/wallet');
const Transaction = require('../../currency/transaction');

describe('Transaction', () =>
{
	let transaction, wallet, recipient, amount;

	beforeEach(() =>
	{
		wallet = new Wallet(80);
		amount = 50;
		recipient = 'some recipient';
		transaction = Transaction.create(wallet, recipient, amount);
	});

	it('outputs the senders public key when creating transaction', () =>
	{
		const out = transaction.output.find(o => o.address === wallet.publicKey);
		expect(out.address).toEqual(wallet.publicKey);
	});

	it('outputs updated senders wallet balance when creating transaction', () =>
	{
		const out = transaction.output.find(o => o.address === wallet.publicKey);
		expect(out.amount).toEqual(wallet.balance - amount);
	});

	it('outputs amount on recipients address wzhen creating transaction', () =>
	{
		const out = transaction.output.find(o => o.address === recipient);
		expect(out.amount).toEqual(amount);
	});

	it('check wallet balance when creating transaction', () =>
	{
		expect(Transaction.create(wallet, recipient, 110)).toBeUndefined();
	});

	it('check amount when creating transaction', () =>
	{
		expect(Transaction.create(wallet, recipient, -10)).toBeUndefined();
	});
});
