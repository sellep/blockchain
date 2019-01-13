const Block = require('../block');
const { DIFFICULTY } = require('../config');

describe('Block', () =>
{
	let data, genesis, block;

	beforeEach(() =>
	{
		data = 'block data';
		genesis = Block.genesis();
		block = Block.mine(genesis, data);
	});

	it('sets the `data` to match the blocks data', () =>
	{
		expect(block.data).toEqual(data);
	});

	it('sets the `prevHash` to match the hash of the previous block', () =>
	{
		expect(block.prevHash).toEqual(genesis.hash);
	});

	it('sets the `timestamp` not to be less than the previous block', () =>
	{
		expect(block.timestamp).not.toBeLessThan(genesis.timestamp);
	});

	it('generates a hash, which fits the difficulty', () =>
	{
		expect(block.hash.substr(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
	});
});
