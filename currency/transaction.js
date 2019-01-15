const Utils = require('../utils');
const { REWARD } = require('../config');

class Transaction
{
    constructor()
    {
        this.id = Utils.id();
        this.input = null;
        this.output = [];
    }

    update(sender, recipient, amount, reference)
    {
        const out = this.output.find(o => o.address === sender.publicKey);

        if (amount > out.amount)
        {
            console.log('insufficient amount');
            return;
        }

        out.amount -= amount;

        this.output.push({ amount, address: recipient, reference: reference });

        Transaction.sign(this, sender);

        return this;
    }

    static create(sender, recipient, amount, reference)
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
                address: recipient,
                reference: reference
            }
        ]);

        Transaction.sign(transaction, sender);

        return transaction;
    }

    static createReward(systemWallet, minerWallet)
    {
        const transaction = new this();

        transaction.output.push(
        {
            amount: REWARD,
            address: minerWallet.publicKey,
            reference: 'mining reward'
        });

        Transaction.sign(transaction, systemWallet);

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
