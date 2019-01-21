const WebSocket = require('ws');
const Block = require('./chain/block');
const Blockchain = require('./chain/blockchain');
const Transaction = require('./currency/transaction');
const TransactionPool = require('./currency/pool');
const Config = require('./config')

const P2P_PORT = process.env.P2P_PORT || 5001;

const MESSAGE_TYPE =
{
    chain: 'CHAIN',
    tran: 'TRANSACTION',
    tran_clear: 'TRANSACTION_CLEAR',
    nodes: 'NODES',
    debug: 'DEBUG'
};

class PeerServer
{

    constructor(chain, pool)
    {
        this.chain = chain;
        this.pool = pool;
        this.sockets = [];
    }

    start()
    {
        const server = new WebSocket.Server({ port: P2P_PORT });

        server.on('connection', socket => this.handleConnection(socket));

        console.log(`[P2P] listening for on ${P2P_PORT}`);
    }
    
    handleConnection(socket)
    {
        console.log(`[P2P] incoming node, send chain`);

        this.connectSocket(socket);

        sendBlockchain(socket, this.chain);
    }

    connect(peer)
    {
        const socket = new WebSocket(peer);

        socket.on('open', () =>
        {
            this.connectSocket(socket);
        });
    }

    connectSocket(socket)
    {
        this.sockets.push(socket);

        socket.on('message', data =>
        {
            const message = JSON.parse(data);

            switch(message.type)
            {
                case MESSAGE_TYPE.chain:
                    this.handleChain(message.data);
                    break;
                case MESSAGE_TYPE.tran:
                    this.handleTransaction(message.data);
                    break;
                case MESSAGE_TYPE.tran_clear:
                    this.handleTransactionClear(message.data);
                    break;
                case MESSAGE_TYPE.debug:
                    console.log(`[P2P] [DEBUG] ${data}`);
                    break;
            }
        });
    }

    handleChain(chain)
    {
        if (!Blockchain.validateBlocks(chain))
        {
            console.log("[P2P] incoming chain is invalid");
        }
        else if (this.chain.sync(chain))
        {
            console.log('[P2P] successfully updated chain');
        }
    }

    handleTransaction(transaction)
    {
        if (!Transaction.verify(transaction))
        {
            console.log("[P2P] incoming transactions signature is invalid");
        }
        else
        {
            this.pool.add(transaction);
            console.log("[P2P] successfully updated transaction pool");
        }
    }

    handleTransactionClear()
    {
        this.pool.clear();
    }

    broadcastChain()
    {
        broadcast(this.sockets, MESSAGE_TYPE.chain, this.chain.blocks);
    }

    broadcastTransaction(transaction)
    {
        broadcast(this.sockets, MESSAGE_TYPE.tran, transaction);
    }

    broadcastTransactionClear()
    {
        broadcast(this.sockets, MESSAGE_TYPE.tran_clear);
    }   
}

function sendBlockchain(socket, chain)
{
    sendTo(socket, JSON.stringify({ type: MESSAGE_TYPE.chain, data: chain.blocks }));
}

function broadcast(sockets, type, data)
{
    const json = JSON.stringify({ type: type, data: data });

    for (let i = 0; i < sockets.length; i++)
    {
        sendTo(sockets[i], json);
    }
}

function sendTo(socket, data)
{
    socket.send(data);
}

module.exports = PeerServer;
