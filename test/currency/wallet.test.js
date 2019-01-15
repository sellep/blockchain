const Wallet = require('../../currency/wallet');
const { REWARD } = require('../../config');

const sender = new Wallet(100);

describe('Wallet.createReward', () =>
{
    let rewardTransaction;

    beforeEach(() =>
    {
        rewardTransaction = sender.createRewardTransaction();
    });

    it('outputs the miners wallet with reward', () =>
    {
        expect(rewardTransaction.output.find(o => o.address === sender.publicKey).amount).toEqual(REWARD);
    });
});