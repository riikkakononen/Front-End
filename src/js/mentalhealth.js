import './main.js';
import { authFetch } from './auth.js';
import { formatDate, extractDate, getTodayString } from './utils/date.js';

const entriesContainer = document.querySelector('#entries');
const entryForm = document.querySelector('.mentalhealthForm');
const formTitle = document.querySelector('#entry-form-title');
const submitBtn = document.querySelector('#entry-submit-btn');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const dateInput = entryForm?.querySelector('#entry_date');
const notesInput = entryForm?.querySelector('#notes');

const selectedMoods = new Set();
const moodButtons = document.querySelectorAll('.mood-btn');

const filterDateInput = document.querySelector('#filter-date');
const clearFilterBtn = document.querySelector('#clear-filter-btn');

let allEntries = [];
let editingEntryId = null;

// Asetetaan create-new-entry-formiin valmiiksi tämän päivän päivämäärä

const setDefaultDate = () => {
    const today = getTodayString();

    if (dateInput) {
        dateInput.value = today;
        dateInput.max = today;
    }
};

// Resetoidaan formi uuden entryn luomistilaan (samalla formilla voi luoda tai muokata entryä)

const resetFormToCreateMode = () => {
    editingEntryId = null;

    entryForm.reset();
    selectedMoods.clear();
    moodButtons.forEach((btn) => btn.classList.remove('selected'));

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

    if (notesInput) {
        notesInput.value = entry.notes || '';
    }

    selectedMoods.clear();
    moodButtons.forEach((button) => {
        button.classList.remove('selected');
    });

    const moods = entry.mood
        ? entry.mood.split(',').map((mood) => mood.trim())
        : [];
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
        <p><strong>Mood:</strong> ${entry.mood || '-'}</p>
        <p><strong>Notes:</strong> ${entry.notes || ''}</p>
        <div class="entry-actions">
            <button type="button" class="edit-entry-btn">Edit</button>
            <button type="button" class="delete-entry-btn">Delete</button>
        </div>  
        `;

        entriesContainer.append(article);
    });
};

// Haetaan entryt

const loadEntries = async () => {
    const response = await authFetch('/mentalhealth');
    
    if (response?.error) {
        console.error('Failed to load entries:', response.error);
        return;
    }

    allEntries = response;
    filterEntriesByDate();
};

// Valitaan mood

moodButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const mood = button.dataset.mood;

        const isSelected = selectedMoods.has(mood);

        selectedMoods[isSelected ? 'delete' : 'add'] (mood);
        button.classList.toggle('selected');
    });
});

// Luodaan tai päivitetään entry

const createOrUpdateEntry = async (event) => {
    event.preventDefault();

    const entry_date = dateInput.value;
    const mood = Array.from(selectedMoods).join(', ');
    const notes = entryForm.querySelector('#notes').value.trim();

    if (!entry_date || (!mood && !notes)) {
        console.error('Entry date and at least either mood or notes is required');
        return;
    }

    const endpoint = editingEntryId
        ? `/mentalhealth/${editingEntryId}`
        : '/mentalhealth';

    const method = editingEntryId ? 'PUT' : 'POST';


    const response = await authFetch(endpoint, {
        method,
        body: JSON.stringify({
            entry_date,
            mood,
            notes,
        }),
    });

    if (response?.error) {
        console.error('Failed to save entry:', response.error);
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

    const response = await authFetch(`/mentalhealth/${entryId}`, {
        method: 'DELETE',
    });

    if (response?.error) {
        console.error('Failed to delete entry:', response.error);
        return;
    }

    if (String(editingEntryId) === String(entryId)) {
        resetFormToCreateMode();
    }

    await loadEntries();
};

// Edit ja delete nappien kuuntelu

entriesContainer?.addEventListener('click', async (event) => {
    const editButton = event.target.closest('.edit-entry-btn');
    const deleteButton = event.target.closest('.delete-entry-btn');

    if (!deleteButton) {
        return;
    }

    const entryCard = deleteButton.closest('.entry-card');
    const entryId = entryCard?.dataset.id;

    if (!entryId) {
        return;
    }

    if (editButton) {
        const entryToEdit = allEntries.find((entry) => String(entry.entry_id) === String(entryId));
        
        if (!entryToEdit) {
            return;
        }

        fillFormForEdit(entryToEdit);
        return;
    }

    if
     (deleteButton) {
        await deleteEntry(entryId);
    }
});

// Päivämäärän vaihto filtterissä

filterDateInput?.addEventListener('change', filterEntriesByDate);

// Tyhjennetään päivämääräfiltteri --> näytetään kaikki entryt

clearFilterBtn?.addEventListener('click', () => {
    filterDateInput.value = '';
    renderEntries(allEntries);
});

// Perutaan muokkaus

cancelEditBtn?.addEventListener('click', () => {
    resetFormToCreateMode();
})

entryForm.addEventListener('submit', createOrUpdateEntry);

setDefaultDate();
loadEntries();