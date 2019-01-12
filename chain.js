const Block = require('./block');

class Chain
{

	constructor()
	{
		this.blocks = [Block.genesis()];
	}

	add(data)
	{
		this.blocks.push(Block.chain(this.blocks[this.blocks.length - 1], data));
	}

	valid()
	{
		for (let i = 0; i < this.blocks.length; i++)
		{
			if (this.blocks[i].hash !== this.blocks[i].compute())
				return false;

			if (i == 0)
				continue;

			if (this.blocks[i - 1].hash !== this.blocks[i].prevHash)
				return false;
		}

		return true;
	}
}

module.exports = Chain;
