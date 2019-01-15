const Transaction = require('./currency/transaction');

class Miner
{

    static mine(p2p, chain, pool, wallet)
    {
        const transactions = pool.transactions;

        // we must add the reward before mining
        transactions.push(wallet.createRewardTransaction());

        // chain.add is actually mining the block
        const block = chain.add(transactions);

        // this is fully out of any sync
        // broadcastChain should also clear the transaction pool
        p2p.broadcastChain();
        pool.clear();
        p2p.broadcastTransactionClear();

        return block;
    }
}

module.exports = Miner;