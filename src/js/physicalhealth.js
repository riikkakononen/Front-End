import './main.js';
import { authFetch } from './auth.js';
import { formatDate, extractDate, getTodayString } from './utils/date.js';

const entriesContainer = document.querySelector('#entries');
const entryForm = document.querySelector('.physicalhealthForm');
const formTitle = document.querySelector('#entry-form-title');
const submitBtn = document.querySelector('#entry-submit-btn');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const filterDateInput = document.querySelector('#filter-date');
const clearFilterBtn = document.querySelector('#clear-filter-btn');

const dateInput = entryForm?.querySelector('#entry_date');
const symptomsInput = entryForm?.querySelector('#symptoms');

const energyButtons = document.querySelectorAll('.energy-btn');

let allEntries = [];
let editingEntryId = null;
let selectedEnergy = '';

// Asetetaan create-new-entry-formiin valmiiksi tämän päivän päivämäärä

const setDefaultDate = () => {
  const today = getTodayString();

  if (dateInput) {
    dateInput.value = today;
    dateInput.max = today;
  }

  if (filterDateInput) {
    filterDateInput.max = today;
  }
};

// Resetoidaan energy level -napit

const resetEnergyButtons = () => {
  selectedEnergy = '';
  energyButtons.forEach((btn) => btn.classList.remove('selected'));
};

// Resetoidaan formi uuden entryn luomistilaan (samalla formilla voi luoda tai muokata entryä)

const resetFormToCreateMode = () => {
  editingEntryId = null;

  entryForm.reset();
  resetEnergyButtons();
  setDefaultDate();

  if (formTitle) {
    formTitle.textContent = 'Create a new entry';
  }

  if (submitBtn) {
    submitBtn.textContent = 'Save entry';
  }

  if (cancelEditBtn) {
    cancelEditBtn.style.display = 'none';
  }
};

// Täytetään formi muokkausta varten vanhan entryn tiedoilla

const fillFormForEdit = (entry) => {
  editingEntryId = entry.entry_id;

  if (formTitle) {
    formTitle.textContent = 'Edit entry';
  }

  if (submitBtn) {
    submitBtn.textContent = 'Update entry';
  }

  if (cancelEditBtn) {
    cancelEditBtn.style.display = 'inline-block';
  } 

  if (dateInput) {
    dateInput.value = extractDate(entry.entry_date);
  }

  if (symptomsInput) {
    symptomsInput.value = entry.symptoms || '';
  }

  // Resetoidaan energy level -napit

  resetEnergyButtons();

  if (entry.energy_level) {
    selectedEnergy = entry.energy_level;

    const matchingButton = document.querySelector(
      `.energy-btn[data-energy="${entry.energy_level}"]`
    );

    if (matchingButton) {
      matchingButton.classList.add('selected');
    }
  }

  entryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
};


// Näytetään entryt

const renderEntries = (entries) => {
  entriesContainer.innerHTML = '';

  if (!entries.length) {
    entriesContainer.innerHTML = '<p>No entries yet</p>';
    return;
  }

  entries.forEach((entry) => {
    const article = document.createElement('article');

    article.className = 'entry-card';
    article.dataset.id = entry.entry_id;

    article.innerHTML = `
      <p><strong>${formatDate(entry.entry_date)}</strong></p>
      <p><strong>Energy level:</strong> ${entry.energy_level || '-'}</p>
      <p><strong>Symptoms:</strong> ${entry.symptoms || ''}</p>
      <div class="entry-actions">
        <button type="button" class="edit-entry-btn">Edit</button>
        <button type="button" class ="delete-entry-btn">Delete</button>
      </div>
    `;

    entriesContainer.append(article);
  });
};

// Filtteröidään entryt päivämäärän mukaan

const filterEntriesByDate = () => {
  const selectedDate = filterDateInput?.value;

  if (!selectedDate) {
    renderEntries(allEntries);
    return;
  }
  
  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = extractDate(entry.entry_date);
    return entryDate === selectedDate;
  });

  renderEntries(filteredEntries);
}

// Haetaan entryt

const loadEntries = async () => {
  const response = await authFetch('/physicalhealth');

  if (response?.error) {
    console.error('Failed to load entries:', response.error);
    return;
  }

  allEntries = response;
  filterEntriesByDate();
};

// Energy level nappien kuuntelu

energyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const energy = button.dataset.energy;

    if (selectedEnergy === energy) {
      selectedEnergy = '';
      button.classList.remove('selected');
      return;
    }

    selectedEnergy = energy;

    energyButtons.forEach((btn) => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

// Luodaan tai muokataan entry

const createOrUpdateEntry = async (event) => {
  event.preventDefault();

  const entry_date = dateInput.value;
  const symptoms = symptomsInput.value.trim();
  const energy_level = selectedEnergy;

  if (!entry_date || (!symptoms && !energy_level)) {
    console.error('Entry date and at least either symptoms or energy level is required');
    return;
  }

  const endpoint = editingEntryId
    ? `/physicalhealth/${editingEntryId}`
    : '/physicalhealth';

  const method = editingEntryId ? 'PUT' : 'POST';

  const response = await authFetch(endpoint, {
    method,
    body: JSON.stringify({
      entry_date,
      symptoms,
      energy_level,
    }),
  });

  if (response?.error) {
    console.error('Failed to create entry:', response.error);
    return;
  }

  resetFormToCreateMode();
  await loadEntries();
};

// Poistetaan entry

const deleteEntry = async (entryId) => {
  const confirmed = window.confirm('Delete this entry?');

  if (!confirmed) {
    return;
  }

  const response = await authFetch(`/physicalhealth/${entryId}`, {
    method: 'DELETE',
  });

  if (response?.error) {
    console.error('Failed to delete entry:', response.error);
  }
  
  if (String(editingEntryId) === String(entryId)) {
    resetFormToCreateMode();
  }

  await loadEntries();
};

// Kuunnellaan edit ja delete -nappeja

entriesContainer?.addEventListener('click', async (event) => {
  const editButton = event.target.closest('.edit-entry-btn');
  const deleteButton = event.target.closest('.delete-entry-btn');

  if (!editButton && !deleteButton) {
    return;
  }

  const entryCard = event.target.closest('.entry-card');
  const entryId = entryCard?.dataset.id;

  if (!entryId) {
    return;
  }

  if (editButton) {
    const entryToEdit = allEntries.find(
      (entry) => String(entry.entry_id) === String(entryId)
    );

    if (!entryToEdit) {
      return;
    }

    fillFormForEdit(entryToEdit);
    return;
  }

  if (deleteButton) {
    await deleteEntry(entryId);
  }
});

// Kuunnellaan muokkauksen perumisnappia

cancelEditBtn?.addEventListener('click', () => {
  resetFormToCreateMode();
});

// Muokataan päivämäärää

filterDateInput?.addEventListener('change', filterEntriesByDate);

// Tyhjennetään päivämääräfiltteri --> näytetään kaikki entryt

clearFilterBtn?.addEventListener('click', () => {
  filterDateInput.value = '';
  renderEntries(allEntries);
});

// Tallennetaan uusi entry tai muokattu entry

entryForm?.addEventListener('submit', createOrUpdateEntry);

setDefaultDate();
loadEntries();