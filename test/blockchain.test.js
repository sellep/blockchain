const Block = require('../block');
const Blockchain = require('../blockchain');

describe('Blockchain', () =>
{
	let chain;

	beforeEach(() =>
	{
		chain = new Blockchain();
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

		expect(Blockchain.validateBlocks(chain.blocks)).toBe(true);
	});

	it('check validity of an invalid data block', () =>
	{
		chain.blocks[0].data = 'Bad data';

		expect(Blockchain.validateBlocks(chain.blocks)).toBe(false);
	});

	it('check validity of an invalid prevHash', () =>
	{
		chain.add('Test block');

		chain.blocks[1].prevHash = 'Bad hash';

		expect(Blockchain.validateBlocks(chain.blocks)).toBe(false);
	});

	it('check validity of an invalid hash', () =>
	{
		chain.add('Test block');

		chain.blocks[0].hash = 'Bad hash';

		expect(Blockchain.validateBlocks(chain.blocks)).toBe(false);
	});

	it('no chain sync if chains have equal length', () =>
	{
		const chainB = new Blockchain();

		chain.add('Chain A');
		chainB.add('Chain B');

		const result = chain.sync(chainB.blocks);

		expect(result).toBe(false);
		expect(chain.blocks).not.toEqual(chainB.blocks);
	});

	it('chain sync if chain is shorter', () =>
	{
                const chainB = new Blockchain();

                chainB.add('Chain B');

		const result = chain.sync(chainB.blocks);

		expect(result).toBe(true);
                expect(chain.blocks).toEqual(chainB.blocks);
        });

	it('no chain sync if chain is not longer', () =>
        {
                const chainB = new Blockchain();

                chain.add('Chain B');

                const result = chain.sync(chainB.blocks);

		expect(result).toBe(false);
                expect(chain.blocks).not.toEqual(chainB.blocks);
        });
});
