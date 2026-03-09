import '../css/api.css';
import { fetchData } from './fetch.js';

console.log('login.js loaded')

const loginUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const loginForm = document.querySelector('.loginForm');
	console.log(loginForm);

	// Haetaan formista arvot
	const email = loginForm.querySelector('input[name="email"]').value.trim();
	const password = loginForm.querySelector('input[name="password"]').value;

	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon

	const bodyData = { email, password };

	// Endpoint
	const url = 'http://localhost:3000/api/users/login';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
	};

	// Hae data
	const response = await fetchData(url, options);

	if (response?.error) {
		console.error('Login failed:', response.error);
		return;
	}

	if (!response?.token || !response?.user) {
		console.error('Unexpected response:', response);
		return;
	}

	// Tallenna auth state

	localStorage.setItem('token', response.token);
	localStorage.setItem('user', JSON.stringify(response.user));

	console.log('Login ok');

	loginForm.reset(); // tyhjennetään formi

	window.location.href = '/~riikkono/AlignmentGuide/';
};

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', loginUser);

