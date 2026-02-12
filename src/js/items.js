import { fetchData } from './fetch.js';

// Render Item in a List in the UI
/////////////////////
const renderFruitList = (items) => {
  console.log('Teen kohta listan');
  // Haetaan fruitlist UL
  const list = document.querySelector('.fruitlist');
  list.innerHTML = '';

  console.log(items);

  items.forEach((item) => {
    console.log(item.name);
    let li = document.createElement('li');
    li.textContent = `Hedelmän id ${item.id} ja nimi ${item.name}`;
    list.appendChild(li);
  });

  // ja lisätään loopissa kaikki yksittäiset
  // hedelmät listaan
};

// GEt items
/////////////////////

const getItems = async () => {

  const items = await fetchData('http://localhost:3000/api/items');

  // jos BE puolelta tulee virhe niin informoidaan
  // joko consoleen tai käyttäjälle virheestä

  if (items.error) {
    console.log(items.error);
    return;
  }

  // tai jatketaan jä tehdään datalle jotain
  // items.forEach((item) => {
  //   console.log(item.name);
  // });

  renderFruitList(items);
};

// Get item by ID

const getItemById = async (event) => {
  console.log('Haetaan IDn avulla!!!');

  event.preventDefault();

  //const idInput = document.getElementById('itemId');
  const idInput = document.querySelector('#itemId');
  const itemId = idInput.value;
  console.log(idInput);

  const url = `http://127.0.0.1:3000/api/items/${itemId}`;

  const options = {
    method: 'GET',
  };

  const item = await fetchData(url, options);

  if (item.error) {
    console.log(item.error);
    return;
  }

  console.log(item);

  const items = await fetchData('http://localhost:3000/api/items');

  // jos BE puolelta tulee virhe niin informoidaan
  // joko consoleen tai käyttäjälle virheestä

  if (items.error) {
    console.log(items.error);
    return;
  }

  console.log(item);
  alert(`Item found :) ${item.name}`);
};

const deleteItemById = async () => {
  console.log('Deletoidaan IDn avulla!!!');

  //const idInput = document.getElementById('itemId');
  const idInput = document.querySelector('#itemId');
  const itemId = idInput.value;
  console.log(itemId);

  // Muista usein tarkistaa että käyttäjä lähettää oikean datan
  if(!itemId) {
    console.log('Item ID missing fill in the details!!!');
    return;
  }

  const confirmed = confirm(`Oletko varma että haluat poistaa itemin: ${itemId}`);

  // jos käyttäjä painaa cancel niin palautuu FALSE ja hypätän pois
  if (!confirmed) return;

  const url = `http://127.0.0.1:3000/api/items/${itemId}`;

  const options = {
    method: 'DELETE',
  };

  const item = await fetchData(url, options);

  if (item.error) {
    console.log(item.error);
    return;
  }

  console.log(item);
  alert(item.message);

  await getItems();
};

const addItem = async (event) => {
  event.preventDefault();

  const form = document.querySelector('add-item-form');
  const fruitName = document.querySelector('#newItemName')
  const fruitWeight = document.querySelector('#newItemWeight')

  if (!fruitName) {
    alert('Nimi puuttuu!!!!');
    return;
  }

  const url = `http://127.0.0.1:3000/api/items`;

  const options = {
    method: 'POST',
    headers: {
		  'Content-Type': 'application/json',
	  },
    body: JSON.stringify({
		  name: fruitName,
		  weight: fruitWeight,
    	}),  
  };

  console.log(url, options);

  const response = await fetchData(url, options);

  if (response.error) {
    console.log(response.error);
    return;
  }

  await getItems();
  console.log(response);
};

export { getItems, getItemById, deleteItemById, addItem };