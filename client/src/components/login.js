(function() {
	const html = `
		<form id='login'>
			<h1 class="title">Login</h1>
			<div class="input-block">
      	<input
          value=''
          type="email"
          placeholder="Email"
          id="email"
          class="input"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          class="input"
        />
        <button type="submit" class="button">Login</button>
      </div>
		</form>
	`;
	const logoutItem = `
  	<button id='logout' class="button" data-navlink="logout">Logout</button>
	`
	const login = async (e) => {
		e.preventDefault()

		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		const result = await (await fetch('http://localhost:4000/login', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			}),
		})).json();

		if (result.accessToken) {
			window.accessToken = result.accessToken;

			this.window.navigate('home');
		} else {
			console.log(result.message);
		}
	}

	window.login = async function (parent) {
		const navItem = this.window.accessToken ? logoutItem : html;

		parent.innerHTML = navItem;

		const form = document.querySelector('#login');

		if (form) {
			form.addEventListener('submit', login);
		}

		const logout = document.querySelector('#logout');

		if (!logout) {
			return;
		}

		logout.addEventListener('click', async () => {
			await fetch('http://localhost:4000/logout', {
				method: 'POST',
				credentials: 'include',
			});

			this.window.accessToken = null;
			this.window.navigate('home');
		})
	}
}())