const express = require('express');
const parser = require('body-parser');
const Blockchain = require('./chain/blockchain');
const PeerServer = require('./p2p');
const Miner = require('./miner');
const Wallet = require('./currency/wallet');
const TransactionPool = require('./currency/pool');
require('./extensions');

const HTTP_PORT = process.env.HTTP_PORT || 8081;

class ApiServer
{

    constructor(chain, p2p, pool, wallet)
    {
        this.app = express();

        this.app.use(parser.json());

        this.app.get('/wallet', (req, res) =>
        {
            res.json({ creation: new Date(wallet.timestamp), address: wallet.publicKey, balance: Wallet.balance(wallet, chain), history: Wallet.history(wallet, chain) });
        });

        this.app.get('/blocks', (req, res) =>
        {
            res.json(chain.blocks);
        });

        this.app.get('/transactions', (req, res) =>
        {
            res.json(pool.transactions);
        });

        this.app.get('/mine-transactions', (req, res) =>
        {
            const block = Miner.mine(p2p, chain, pool, wallet);

            console.log('[API] new block added');

            res.redirect('/blocks');
        });

        this.app.post('/mine', (req, res) =>
        {
            chain.add(req.body.data);

            p2p.broadcastChain();

            res.redirect('/blocks');
        });

        this.app.post('/transact', (req, res) =>
        {
            const transaction = wallet.createTransaction(req.body.recipient, req.body.amount, req.body.reference, pool);

            p2p.broadcastTransaction(transaction);

            res.redirect('/transactions');
        });
    }

    start()
    {
        this.app.listen(HTTP_PORT, () =>
        {
            console.log(`[Api] listening on port ${HTTP_PORT}`);
        });
    }
}

module.exports = ApiServer;