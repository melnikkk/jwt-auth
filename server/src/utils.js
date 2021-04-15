const { sign, verify } = require('jsonwebtoken');

exports.createAccessToken = (userID) => (
	sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	})
);

exports.createRefreshToken = (userID) => (
	sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	})
);

exports.sendRefreshToken = (res, token) => {
	res.cookie('refreshtoken', token, {
		httpOnly: true,
		path: '/refresh_token'
	});
};

exports.sendAccessToken = (res, req, token) => {
	res.send({
		accessToken: token,
		email: req.body.email,
	});
};

exports.isAuth = (req) => {
	const auth = req.headers['authorization'];

	if (!auth) {
		throw new Error('Login, please :/')
	}

	const token = auth.split(' ')[1];
	const { userID } = verify(token, process.env.ACCESS_TOKEN_SECRET);

	return userID
}