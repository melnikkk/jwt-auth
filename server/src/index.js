require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { hash, compare } = require('bcryptjs');
const {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken
} = require('./token');
const { fakeDB } = require('../db');

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
	res.send('*PING*')
});

server.post('/register', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = fakeDB.find((user) => user.email === email);

		if (user) {
			throw new Error('User already exist');
		}

		const hashPassword = await hash(password, 10);

		fakeDB.push({
			id: fakeDB.length,
			email,
			password: hashPassword,
		});

		res.send({
			message: 'User successfully created :)'
		});

	} catch (error) {
		res.send({
			message: `${error.message}`,
		})
	}
});

server.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = fakeDB.find((user) => user.email === email);

		if (!user) {
			throw new Error('User does not exist :(');
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error('Wrong password :|');
		}

		const accessToken = createAccessToken(user.id);
		const refreshtoken = createRefreshToken(user.id);

		user.refreshtoken = refreshtoken;

		sendRefreshToken(res, refreshtoken);
		sendAccessToken(res, req, accessToken);

	} catch (error) {
		res.send({
			message: `${error.message}`
		})
	}
});

server.post('/logout', async (req, res) => {
	res.clearCookie('refreshtoken', { path: '/refresh_token'});

	//Code here to remove refresh token from the db

	return res.send({
		message: 'Logged out :(',
	});
})
