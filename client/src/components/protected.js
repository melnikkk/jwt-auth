(function () {
	const html = `<h1 class='title'>Protected Route</h1>`;

	window.protected = async function (parent) {
		if (!window.accessToken) {
			window.navigate('login');
			return;
		}

		console.log('accessToken: ', window.accessToken);

		const result = await (await fetch('http://localhost:4000/protected', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${window.accessToken}`
			}
		})).json();

		if (result.data) {
			parent.innerHTML = result.data;
		} else {
			parent.innerHTML = 'NOT AUTHORISED!!!!'
		}
	}
}())