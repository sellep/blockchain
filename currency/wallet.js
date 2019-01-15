const Utils = require('../utils');
const Transaction = require('./transaction');

class Wallet
{
    constructor(balance)
    {
        const kp = Utils.genKeys();

        this.timestamp = Date.now();
        this.balance = balance;
        this.publicKey = kp.getPublic().encode('hex');
        this.keyPair = kp;
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
            pool.add(transaction);
        }

        return transaction;
    }

    createRewardTransaction()
    {
        return Transaction.createReward(Wallet.system(), this);
    }

    static balance(wallet, chain)
    {
        let balance = wallet.balance;
        let transactions = [];
        let startTime = 0;
        chain.blocks.forEach(b => b.data.forEach(t => transactions.push(t))); // push every transaction

        const walletInputTs = transactions.filter(t => t.input.address === wallet.publicKey);

        if (walletInputTs.length > 0)
        {
            const recentInputTs = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);

            balance = recentInputTs.output.find(o => o.address === wallet.publicKey).amount;
            startTime = recentInputTs.input.timestamp;
        }

        transactions.forEach(t =>
        {
            if (t.input.timestamp > startTime)
            {
                t.output.forEach(o =>
                {
                    if (o.address === wallet.publicKey)
                    {
                        balance += o.amount;
                    }
                });
            }
        });

        return balance;
    }

    static system()
    {
        const wallet = new this(100);
        wallet.address = 'blockchain-wallet';
        return wallet;
    }
}

module.exports = Wallet;