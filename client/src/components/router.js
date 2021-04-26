const links = document.querySelectorAll('.nav-item');
const content = document.querySelector('#content');

const navigate = (link) => {
	debugger
	window[link](content);
}

links.forEach((link) => {
	link.addEventListener('click', (e) => {
		const navLink = e.target.dataset.navlink;
		debugger
		navigate(navLink);
	})
});

async function checkRefreshToken() {
	const result = await (
		await fetch(`http://localhost:4000/refreshtoken`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-type': 'application/json',
			}
		})
	).json();

	window.accessToken = result.accessToken
}

window.navigate = navigate;

checkRefreshToken();