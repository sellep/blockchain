const Blockchain = require('./blockchain');
const ApiServer = require('./api');
const PeerServer = require('./p2p');

const chain = new Blockchain();
const p2p = new PeerServer(chain);
const api = new ApiServer(chain, p2p);

p2p.start();
api.start();
