import '../css/style.css';
import '../css/mobile.css';
import { logout } from '../js/auth.js';

const user = JSON.parse(localStorage.getItem('user'));
const authItem = document.querySelector('#auth-link');
const authLink = authItem?.querySelector('a');
const submenu = authItem?.querySelector('.submenu');
const protectedLinks = document.querySelectorAll('.requires-auth');

if (!user) {
  protectedLinks.forEach((item) => {
    item.style.display = 'none';
  });
}

if (user && authLink) {
  authLink.removeAttribute('href');
  authLink.textContent = user.username;

  submenu.innerHTML = `
  <li><a href="#" id="logout-btn">Log out</a></li>
  `;

const logoutBtn = document.querySelector('#logout-btn');

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault();

  logout();

});
};