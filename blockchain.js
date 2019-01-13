const Block = require('./block');

class Blockchain
{

	constructor()
	{
		this.blocks = [Block.genesis()];
	}

	add(data)
	{
		this.blocks.push(Block.mine(this.blocks[this.blocks.length - 1], data));
	}

	static validateBlocks(blocks)
	{
		if (blocks[0].hash !== Block.hash(blocks[0].timestamp, blocks[0].prevHash, blocks[0].data, blocks[0].nonce))
			return false;

		for (let i = 1; i < blocks.length; i++)
		{
			if (blocks[i].hash !== Block.hash(blocks[i].timestamp, blocks[i - 1].hash, blocks[i].data, blocks[i].nonce))
				return false;

			if (blocks[i - 1].hash !== blocks[i].prevHash)
				return false;
		}

		return true;
	}

	sync(blocks)
	{
		if (this.blocks.length >= blocks.length)
			return false;

		this.blocks = blocks;
		return true;
	}
}

module.exports = Blockchain;
