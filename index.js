const Blockchain = require('./chain/blockchain');
const ApiServer = require('./api');
const PeerServer = require('./p2p');

const TransactionPool = require('./currency/pool');
const Wallet = require('./currency/wallet');

const Config = require('./config')

let wallet;

if (!process.env.NO_WALLET)
{
    wallet = new Wallet(100);
}

const chain = new Blockchain();
const pool = new TransactionPool();

const p2p = new PeerServer(chain, pool);
const api = new ApiServer(chain, p2p, pool, wallet);

p2p.start();
api.start();