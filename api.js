const express = require('express');
const parser = require('body-parser');
const Chain = require('./chain');

const HTTP_PORT = 8081;

const app = express();
const chain = new Chain();

app.use(parser.json());

app.get('/blocks', (req, res) =>
{
	res.json(chain.blocks);
});


app.post('/mine', (req, res) =>
{
	chain.add(req.body.data);

	res.redirect('/blocks');
});

app.listen(HTTP_PORT, () =>
{
	console.log(`Listening on port ${HTTP_PORT}`);

});
