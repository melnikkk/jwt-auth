const { sign } = require('jsonwebtoken');

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
	res.cookie('refreshToken', token, {
		httpOnly: true,
		path: '/refresh_token'
	});
};

exports.sendAccessToken = (res, req, token) => {
	res.send('refreshToken', {
		accessToken: token,
		email: req.body.email,
	});
};