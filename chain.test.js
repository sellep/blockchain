const Block = require('./block');
const Chain = require('./chain');

describe('Chain', () =>
{
	let chain;

	beforeEach(() =>
	{
		chain = new Chain();
	});

	it('starts with the genesis block', () =>
	{
		expect(chain.blocks[0].data).toEqual(Block.genesis().data);
	});

	it ('adds a new block to the end of the chain', () =>
	{
		const data = "Test block";

		chain.add(data);

		expect(chain.blocks[chain.blocks.length - 1].data).toEqual(data);
	});
});
