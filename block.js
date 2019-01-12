const sha256 = require('crypto-js/sha256')

class Block
{

	constructor(prevHash, data)
	{
		this.timestamp = Date.now();
		this.prevHash = prevHash;
		this.data = data;

		this.hash = Block.compute(this);
	}

	static compute(block)
	{
		return sha256(`${block.timestamp}${block.prevHash}${block.data}`).toString();
	}

	static genesis()
	{
		return new this('', 'Genesis Block');
	}

	static chain(lastBlock, data)
	{
		return new this(lastBlock.hash, data);
	}
}

module.exports = Block;
