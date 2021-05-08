require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken,
	isAuth,
} = require('./utils');
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
		});
	}
});

server.post('/logout', async (req, res) => {
	res.clearCookie('refresh_token', { path: '/refresh_token'});

	//Code here to remove refresh token from the db

	return res.send({
		message: 'Logged out :(',
	});
});

server.post('/protected', async (req, res) => {
	try {
		const userID = isAuth(req);

		if (userID === null) {
			res.send({
				data: 'No access :|'
			})
		}

		res.send({
			data: 'Got access :)'
		})
	} catch (error) {
		res.send({
			error: `${error.message}`,
		})
	}
});

server.post('/refreshtoken', (req, res) => {
	const cookiesRefreshToken = req.cookies.refreshtoken;

	if (!cookiesRefreshToken) {
		res.send({
			accesstoken: '',
		})
	}

	let payload;

	try {
		payload = verify(cookiesRefreshToken, process.env.REFRESH_TOKEN_SECRET);

	} catch (error) {
		return res.send({
			accesstoken: '',
		});
	}

	const user = fakeDB((user) => user.id === payload.userID);

	if (!user) {
		return res.send({
			accesstoken: '',
		});
	}

	if (user.refreshtoken !== cookiesRefreshToken) {
		return res.send({
			accesstoken: '',
		});
	}

	const accesstoken = createAccessToken(user.id);
	const refreshtoken = createRefreshToken(user.id);

	// DB user update logic here
	user.refreshtoken = refreshtoken;

	sendRefreshToken(res, refreshtoken);

	return res.send({ accesstoken });
});
