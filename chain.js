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
}

module.exports = Chain;
