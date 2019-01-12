const sha256 = require('crypto-js/sha256')

class Block
{

	constructor(prevHash, data)
	{
		this.timestamp = Date.now();
		this.prevHash = prevHash;
		this.data = data;

		this.hash = sha256(`${this.timestamp}${this.prevHash}${this.data}`).toString();
	}

	static genesis()
	{
		return new this('', "Genesis Block");
	}

	static chain(lastBlock, data)
	{
		return new this(lastBlock.hash, data);
	}

	toString()
	{
		return `Block\n\tTimestamp\t${this.timestamp}\n\tPrevious Hash\t${this.prevHash.substring(0, 10)}\n\tBlock Hash\t${this.hash.substring(0, 10)}\n\tData\t\t${this.data}`;
	}
}

module.exports = Block;
