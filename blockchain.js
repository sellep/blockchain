const Block = require('./block');

class Blockchain
{

	constructor()
	{
		this.blocks = [Block.genesis()];
	}

	add(data)
	{
		this.blocks.push(Block.chain(this.blocks[this.blocks.length - 1], data));
	}

	static validateBlocks(blocks)
	{
		for (let i = 0; i < blocks.length; i++)
		{
			if (blocks[i].hash !== Block.compute(blocks[i]))
				return false;

			if (i == 0)
				continue;

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
