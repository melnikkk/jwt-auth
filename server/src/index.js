require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = express();

server.use(cookieParser());
server.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}))

server.use(express.json());

server.use(express.urlencoded({ extended:true}));

server.listen(process.env.PORT, () => {
	console.log(`Server listening on port: ${process.env.PORT} :)`);
});

// test route
server.get('/ping', async(req, res) => {
	res.send('PING')
});
