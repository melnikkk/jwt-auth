(function () {
	const html = `
        <form id="register">
          <h1 class="title">Register</h1>
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
            <button type="submit" class="button">Register</button>
          </div>
        </form>
        `;

	const register = async (e) => {
		e.preventDefault();
		let email = document.querySelector("#email").value;
		let password = document.querySelector("#password").value;


		const result = await (await fetch(`http://localhost:4000/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})).json();
		if (!result.error) {
			console.log(result.message);
			//navigate('/');
		} else {
			console.log(result.error);
		}
	}

	window.register = function (parent) {
		parent.innerHTML = html;
		const form = document.getElementById('register');
		form.addEventListener('submit', register);
	};
}());