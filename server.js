const express = require('express');
const server = express();
const postRouter = require('./router/posts-router');

server.use(express.json());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
	res.send(`
	<h1>Api Running</h1>
	`);
});

module.exports = server;
