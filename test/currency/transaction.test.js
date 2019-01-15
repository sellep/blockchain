const Wallet = require('../../currency/wallet');
const Transaction = require('../../currency/transaction');
const { REWARD } = require('../../config');

const sender = new Wallet(80), amount = 50, recipient = 'recipient';

describe('Transaction', () =>
{
    let transaction;

    beforeEach(() =>
    {
        transaction = Transaction.create(sender, recipient, amount);
    });

    it('outputs the senders public key when creating transaction', () =>
    {
        expect(transaction.output.find(o => o.address === sender.publicKey)).toEqual(expect.anything());
    });

    it('outputs updated senders balance when creating transaction', () =>
    {
        expect(transaction.output.find(o => o.address === sender.publicKey).amount).toEqual(sender.balance - amount);
    });

    it('outputs amount on recipients address when creating transaction', () =>
    {
        expect(transaction.output.find(o => o.address === recipient).amount).toEqual(amount);
    });

    it('check wallet balance when creating transaction', () =>
    {
        expect(Transaction.create(sender, recipient, 110)).toBeUndefined();
    });

    it('check amount when creating transaction', () =>
    {
        expect(Transaction.create(sender, recipient, -10)).toBeUndefined();
    });

    it('inputs the senders balance', () =>
    {
        expect(transaction.input.amount).toEqual(sender.balance);
    });

    it('verifies a valid signature', () =>
    {
        expect(Transaction.verify(transaction)).toBe(true);
    });

    it('verifies an invalid signature', () =>
    {
        transaction.output[0].amount = 50000;
        expect(Transaction.verify(transaction)).toBe(false);
    });

    describe('Transaction.update', () =>
    {
        const recipient2 = 'recipient 2', amount2 = 20;

        beforeEach(() =>
        {
            transaction = transaction.update(sender, recipient2, amount2);
        });

        it('update outputs address and amount', () =>
        {
            expect(transaction.output.find(o => o.address === recipient2).amount).toEqual(amount2);
        });

        it('outputs on insufficient balance', () =>
        {
            expect(transaction.update(sender, 'recipient 3', 50)).toBeUndefined();
        });

        it('subtrats the senders balance', () =>
        {
            expect(transaction.output.find(o => o.address === sender.publicKey).amount).toEqual(sender.balance - amount - amount2);
        });

        it('verifies a valid updated signature', () =>
        {
            expect(Transaction.verify(transaction)).toBe(true);
        });
    });
});
