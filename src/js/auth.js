import { fetchData } from "../js/fetch.js";

const API_BASE  = 'http://localhost:3000/api';

// Haetaan token
const getToken = () => {
    return localStorage.getItem('token');
};

// Haetaan käyttäjä
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Kirjaudutaan ulos, poistetaan token ja käyttäjä localStoragesta
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
};


const authFetch = async (endpoint, options = {}) => { // Saadaan endpoint ja mahdolliset fetchin options
    const token  = getToken(); // Haetaan token

    const headers = {  // Luodaan header-objekti
        'Content-Type': 'application/json',
        ...(options.headers || {}), // Jos optionsissa on headerit, ne lisätään myös mukaan
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`; // Jos löytyy token, Bearer ja token korvaa 'application/json' headerissa
    };

    const url = `${API_BASE}${endpoint}`; // Lisätään endpoint APIn urliin

    return fetchData(url, {
        ...options,
        headers,
    });
};

export { getToken, getUser, logout, authFetch };