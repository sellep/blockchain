const Transaction = require('./currency/transaction');

class Miner
{

    static mine(p2p, chain, pool, wallet)
    {
        const transactions = pool.transactions;
        transactions.push(wallet.createRewardTransaction());
        const block = chain.add(transactions);
        p2p.broadcastChain();
        pool.clear();
        p2p.broadcastTransactionClear();

        return block;
    }
}

module.exports = Miner;