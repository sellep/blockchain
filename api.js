const express = require('express');
const parser = require('body-parser');
const Blockchain = require('./blockchain');
const PeerServer = require('./p2p');
const TransactionPool = require('./currency/pool');

const HTTP_PORT = process.env.HTTP_PORT || 8081;

class ApiServer
{

    constructor(chain, p2p, pool, wallet)
    {
        this.app = express();

        this.app.use(parser.json());

        this.app.get('/blocks', (req, res) =>
        {
            res.json(chain.blocks);
        });

        this.app.get('/transactions', (req, res) =>
        {
            res.json(pool.transactions);
        });

        this.app.post('/mine', (req, res) =>
        {
            chain.add(req.body.data);

            p2p.broadcast();

            res.redirect('/blocks');
        });

        this.app.post('/transact', (req, res) =>
        {
            wallet.createTransaction(req.body.recipient, req.body.amount, pool);

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
