const sha256 = require('crypto-js/sha256')
const { DIFFICULTY } = require('./config');
require('./string');

class Block
{

	constructor(timestamp, hash, prevHash, data, nonce)
	{
		this.timestamp = timestamp;
		this.hash = hash;
		this.prevHash = prevHash;
		this.data = data;
		this.nonce = nonce;
	}

	static mine(prevBlock, data)
	{
		let timestamp, nonce = '0', hash;

		const sub = '0'.repeat(DIFFICULTY);

		while (true)
		{
			timestamp = Date.now();
			hash = Block.hash(timestamp, prevBlock.hash, data, nonce);

			if (hash.substr(0, DIFFICULTY) === sub)
				return new Block(timestamp, hash, prevBlock.hash, data, nonce);

			nonce = Block.increment(nonce);
		}
	}

	static genesis()
	{
		const timestamp = Date.now();
		const prevHash = '';
		const data = 'Genesis block';
		const nonce = '';

		return new this(timestamp, Block.hash(timestamp, prevHash, data, nonce), prevHash, data, nonce);
	}

	static hash(timestamp, prevHash, data, nonce)
	{
		return sha256(`${timestamp}${prevHash}${data}${nonce}`).toString();
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
}

module.exports = Block;
