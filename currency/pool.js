const Transaction = require('./transaction');

class TransactionPool
{

    constructor()
    {
        this.transactions = [];
    }

    add(transaction)
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

    clear()
    {
        this.transactions = [];
    }

    find(inputAddress)
    {
        return this.transactions.find(t => t.input.address == inputAddress);
    }
}

module.exports = TransactionPool;

