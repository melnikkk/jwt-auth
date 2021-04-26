(function() {
	const html = `
		<h1 class="title">Welcome Home !)</h1>
	`;

	window.home = async function (parent) {
		parent.innerHTML = html;
	}
}());