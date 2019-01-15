const Utils = require('../utils');
const { DIFFICULTY, MINE_RATE } = require('../config');
require('../extensions');

class Block
{

    constructor(timestamp, hash, prevHash, data, nonce, difficulty)
    {
        this.timestamp = timestamp;
        this.hash = hash;
        this.prevHash = prevHash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static mine(prevBlock, data)
    {
        let timestamp, nonce = '0', hash, { difficulty } = prevBlock;

        while (true)
        {
            timestamp = Date.now();
            difficulty = Block.difficulty(prevBlock, timestamp);
            hash = Block.hash(timestamp, prevBlock.hash, data, nonce, difficulty);

            if (hash.substr(0, difficulty) === '0'.repeat(difficulty))
                return new Block(timestamp, hash, prevBlock.hash, data, nonce, difficulty);

            nonce = Block.increment(nonce);
        }
    }

    static genesis()
    {
        const data = [];
        const prev = { timestamp: 0, hash: '', difficulty: DIFFICULTY };

        return Block.mine(prev, data);
    }

    static hash(timestamp, prevHash, data, nonce, difficulty)
    {
        return Utils.hash(`${timestamp}${prevHash}${data}${nonce}${difficulty}`);
    }

    static increment(nonce)
    {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const last = chars[chars.length - 1];

        for (let i = nonce.length - 1; i >= 0; i--)
        {
            if (nonce[i] == last)
            {
                nonce = nonce.replaceAt(i, chars[0]);
            }
            else
            {
                nonce = nonce.replaceAt(i, chars[chars.indexOf(nonce[i]) + 1]);
                return nonce;
            }
        }

        return chars[0] + nonce;
    }

    static difficulty(prevBlock, timestamp)
    {
        const { difficulty } = prevBlock;

        return prevBlock.timestamp + MINE_RATE > timestamp
            ? difficulty + 1
            : difficulty > 1
                ? difficulty - 1
                : difficulty;
    }
}

module.exports = Block;
