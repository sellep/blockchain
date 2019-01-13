const WebSocket = require('ws');
const Block = require('./block');
const Blockchain = require('./blockchain');
const Wallet = require('./currency/wallet');
const TransactionPool = require('./currency/pool');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class PeerServer
{

	constructor(chain, pool, wallet)
	{
		this.chain = chain;
		this.pool = pool;
		this.wallet = wallet;
		this.sockets = [];
	}

	start()
	{
		const server = new WebSocket.Server({ port: P2P_PORT });
		server.on('connection', socket => this.connectSocket(socket));

		this.connectToPeers();

		console.log(`[P2P] listening for on ${P2P_PORT}`);
	}

	connectToPeers()
	{
		peers.forEach(peer =>
		{
			const socket = new WebSocket(peer);

			socket.on('open', () =>
			{
				this.connectSocket(socket);
			});
		});
	}

	connectSocket(socket)
	{
		this.sockets.push(socket);

		socket.on('message', message =>
		{
			const blocks = JSON.parse(message);

			if (!Blockchain.validateBlocks(blocks))
			{
				console.log("[P2P] incoming chain was invalid");
			}
			else if (this.chain.sync(blocks))
			{
				console.log('[P2P] successfully updated chain');
			}
		});

		this.sendTo(socket);

		console.log('[P2P] socket connected');

	}

	broadcast()
	{
		this.sockets.forEach(socket => this.sendTo(socket));
	}

	sendTo(socket)
	{
		socket.send(JSON.stringify(this.chain.blocks));
	}
}

module.exports = PeerServer;
