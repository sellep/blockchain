const http = require('http');
const block = require('./block');

var server = http.createServer(function (req, res)
{
	const b = new block('ts', 'prevhash', 'hash', 'data');


	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(`${b.toString()}`);
});

server.listen(8080);
