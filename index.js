const Blockchain = require('./blockchain');
const ApiServer = require('./api');
const PeerServer = require('./p2p');

const TransactionPool = require('./currency/pool');
const Wallet = require('./currency/wallet');

const wallet = new Wallet(100);
const pool = new TransactionPool();

const chain = new Blockchain();
const p2p = new PeerServer(chain, pool, wallet);
const api = new ApiServer(chain, p2p, pool, wallet);

p2p.start();
api.start();
