import '../css/api.css';
import { fetchData } from './fetch.js';

const registerUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const registerForm = document.querySelector('.registerForm');

	// Haetaan formista arvot
	const username = registerForm.querySelector('#username').value.trim();
	const password = registerForm.querySelector('#password').value;
	const email = registerForm.querySelector('#email').value.trim();

	if (!username || !password || !email) {
		console.error('All fields are required');
		return;
	}
	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
	const bodyData = {
		username: username,
		password: password,
		email: email,
	};

	// Endpoint
	const url = 'http://localhost:3000/api/users';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
	};

	// Hae data
	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error adding a new user:', response.error);
		return;
	}

	if (response.message) {
		console.log(response.message, 'success');
	}

	console.log(response);
	registerForm.reset(); // tyhjennetään formi

	window.location.href = '/~riikkono/AlignmentGuide/login/';
};

const registerForm = document.querySelector('.registerForm');
registerForm.addEventListener('submit', registerUser);
