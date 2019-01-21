const express = require('express');
const parser = require('body-parser');
const Miner = require('./miner');
const Wallet = require('./currency/wallet');
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
            if (wallet)
            {
                res.json({ creation: new Date(wallet.timestamp), address: wallet.publicKey, balance: Wallet.balance(wallet, chain), history: Wallet.history(wallet, chain) });
            }
            else
            {
                res.json('no wallet');
            } 
        });

        this.app.get('/blockchain', (req, res) =>
        {
            res.json(chain.blocks);
        });

        this.app.get('/transactions', (req, res) =>
        {
            res.json(pool.transactions);
        });

        this.app.get('/mine', (req, res) =>
        {
            if (wallet)
            {
                const block = Miner.mine(p2p, chain, pool, wallet);

                console.log('[API] new block added');
    
                res.redirect('/blockchain');
            }
            else
            {
                res.json('no wallet');
            }            
        });

        this.app.post('/transact', (req, res) =>
        {
            if (wallet)
            {
                const transaction = wallet.createTransaction(chain, pool, req.body.recipient, req.body.amount, req.body.reference);

                p2p.broadcastTransaction(transaction);
    
                res.redirect('/transactions');
            }
            else
            {
                res.json('no wallet');
            } 
        });

        this.app.post('/connect', (req, res) =>
        {
            const { peer } = req.body;
            p2p.connect(peer);
            res.json("welcome to the blockchain network");
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