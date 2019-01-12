const express = require('express');
const parser = require('body-parser');
const Blockchain = require('./blockchain');
const P2pServer = require('./p2p');

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const app = express();
const chain = new Blockchain();
const p2p = new P2pServer(chain);

app.use(parser.json());

app.get('/blocks', (req, res) =>
{
	res.json(chain.blocks);
});


app.post('/mine', (req, res) =>
{
	chain.add(req.body.data);

	p2p.broadcast();

	res.redirect('/blocks');
});

app.listen(HTTP_PORT, () =>
{
	console.log(`Listening on port ${HTTP_PORT}`);

});

p2p.listen();
