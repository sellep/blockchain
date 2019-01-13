const Blockchain = require('./blockchain');

const chain = new Blockchain();

for (let i = 0; i < 100; i++)
{
	console.log(chain.add(`Block ${i}`));
}
