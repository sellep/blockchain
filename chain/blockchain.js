const Block = require('./block');
const Config = require('../config');

class Blockchain
{

    constructor()
    {
        this.blocks = [ Block.genesis() ];
    }

    add(data)
    {
        const block = Block.mine(this.blocks[this.blocks.length - 1], data);
        this.blocks.push(block);
        return block;
    }

    sync(blocks)
    {
        if (this.blocks.length >= blocks.length)
            return false;

        this.blocks = blocks;
        return true;
    }

    static validateBlocks(blocks)
    {
        if (blocks[0].hash !== Block.hash(blocks[0].timestamp, blocks[0].prevHash, blocks[0].data, blocks[0].nonce, blocks[0].difficulty))
            return false;

        if (blocks[0].hash.substr(0, blocks[0].difficulty) !== '0'.repeat(blocks[0].difficulty))
            return false;

        for (let i = 1; i < blocks.length; i++)
        {
            if (blocks[i].hash !== Block.hash(blocks[i].timestamp, blocks[i - 1].hash, blocks[i].data, blocks[i].nonce, blocks[i].difficulty))
                return false;

            if (blocks[0].hash.substr(0, blocks[0].difficulty) !== '0'.repeat(blocks[0].difficulty))
                return false;

            if (blocks[i - 1].hash !== blocks[i].prevHash)
                return false;
        }

        return true;
    }
}

module.exports = Blockchain;
