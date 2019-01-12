const sha256 = require('crypto-js/sha256')

class Block
{

	constructor(prevHash, data)
	{
		this.timestamp = Date.now();
		this.prevHash = prevHash;
		this.data = data;

		this.hash = this.compute();
	}

	compute()
	{
		return sha256(`${this.timestamp}${this.prevHash}${this.data}`).toString();
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
