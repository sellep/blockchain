const Block = require('../block');

describe('Block', () =>
{
	let data, genesis, block;

	beforeEach(() =>
	{
		data = 'block data';
		genesis = Block.genesis();
		block = Block.chain(genesis, data);

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
});
