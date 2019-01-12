const Block = require('../block');
const Chain = require('../chain');

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

	it('adds a new block to the end of the chain', () =>
	{
		const data = 'Test block';

		chain.add(data);

		expect(chain.blocks[1].data).toEqual(data);
	});

	it('check validity of a valid chain', () =>
	{
		chain.add('Test block');

		expect(chain.valid()).toBe(true);
	});

	it('check validity of an invalid data block', () =>
	{
		chain.blocks[0].data = 'Bad data';

		expect(chain.valid()).toBe(false);
	});

	it('check validity of an invalid prevHash', () =>
	{
		chain.add('Test block');

		chain.blocks[1].prevHash = 'Bad hash';

		expect(chain.valid()).toBe(false);
	});

	it('check validity of an invalid hash', () =>
	{
		chain.add('Test block');

		chain.blocks[0].hash = 'Bad hash';

		expect(chain.valid()).toBe(false);
	});

	it('no chain sync if chains are from equal length', () =>
	{
		const chainB = new Chain();

		chain.add('Chain A');
		chainB.add('Chain B');

		Chain.sync(chain, chainB);

		expect(chain.blocks).not.toEqual(chainB.blocks);
	});

	it('chain sync if chain a is longer than chain b', () =>
	{
                const chainB = new Chain();

                chain.add('Chain A');

		Chain.sync(chain, chainB);

                expect(chainB.blocks).toEqual(chain.blocks);
        });

	it('chain sync if chain b is longer than chain a', () =>
        {
                const chainB = new Chain();

                chainB.add('Chain B');

                Chain.sync(chain, chainB);

                expect(chain.blocks).toEqual(chainB.blocks);
        });
});
