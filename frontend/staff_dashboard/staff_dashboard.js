const API_BASE = '/api/staff';
let currentCategories = [];

// Modal Management
function openModal(type) {
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');

    switch(type) {
        case 'current-words':
            title.textContent = 'Current Word List';
            content.innerHTML = getCurrentWordsContent();
            loadCategoriesForEdit();
            loadCurrentWords();
            break;
        case 'edit-words':
            title.textContent = 'Edit Word List';
            content.innerHTML = getEditWordsContent();
            setTimeout(loadCategoriesForEdit, 0);  
            break;
        case 'all-sentences':
            title.textContent = 'All Sentences';
            content.innerHTML = getAllSentencesContent();
            loadSentences();
            break;
        case 'edit-sentences':
            title.textContent = 'Edit Sentences';
            content.innerHTML = getEditSentencesContent();
            loadCategoriesForEdit();
            break;
    }

    overlay.style.display = 'block';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/login.html';
    }
}

// Modal Content Templates
function getCurrentWordsContent() {
    return `
        <div class="form-section">
            <h3>Filter Words</h3>
            <label>Category:</label>
            <select id="filter-category">
                <option value="">All Categories</option>
            </select>
            <button class="btn" onclick="loadCurrentWords()">Refresh</button>
        </div>
        <div id="words-display"></div>
    `;
}

function getEditWordsContent() {
    return `
        <div class="form-section">
            <h3>Categories Management</h3>
            <input type="text" id="new-category-name" placeholder="New category name">
            <button class="btn" onclick="createCategory()">Add Category</button>
            <div id="categories-list"></div>
        </div>
        <div id="add-category-results" class="results" style="display: none;"></div>

        <div class="form-section">
            <h3>Delete Category</h3>
            <select id="delete-category-select">
                <option value="">Select Category</option>
            </select>
            <button class="btn btn-danger" onclick="deleteCategoryFrontend()">Delete Category</button>
            <div id="delete-category-results" class="results" style="display: none;"></div>
        </div>

        <div class="form-section">
            <h3>Add New Word</h3>
            <input type="text" id="new-english" placeholder="English word">
            <input type="text" id="new-french" placeholder="French word">
            <select id="new-word-category">
                <option value="">Select Category</option>
            </select>
            <button class="btn" onclick="createWord()">Add Word</button>
            <div id="add-word-results" class="results" style="display: none;"></div>
        </div>

        <div class="form-section">
            <h3>Edit/Delete Words</h3>
            <input type="number" id="edit-word-id" placeholder="Enter word ID">
            <button class="btn btn-secondary" onclick="loadWordForEdit()">Load Word</button>
            <button class="btn btn-danger" onclick="deleteWord()">Delete</button>
            <div id="edit-word-form" style="display: none; margin-top: 10px;">
                <input type="text" id="edit-english" placeholder="English">
                <input type="text" id="edit-french" placeholder="French">
                <input type="number" id="edit-category-id" placeholder="Category ID">
                <button class="btn" onclick="updateWord()">Update Word</button>
            </div>
        </div>

        <div id="edit-results" class="results" style="display: none;"></div>
    `;
}

function getAllSentencesContent() {
    return `
        <div class="form-section">
            <h3>All Sentences</h3>
            <div id="sentences-display"></div>
        </div>
    `;
}

function getEditSentencesContent() {
    return `
        <div class="form-section">
            <h3>Add New Sentence</h3>
            <input type="text" id="new-sentence-english" placeholder="English sentence">
            <input type="text" id="new-sentence-french" placeholder="French sentence">
            <input type="text" id="new-sentence-shuffled" placeholder="Shuffled (French)">
            <select id="new-sentence-category">
                <option value="">Select Category</option>
            </select>
            <button class="btn" onclick="createSentence()">Add Sentence</button>
            <div id="add-sentence-results" class="results" style="display: none;"></div>
        </div>
        <div class="form-section">
            <h3>Edit/Delete Sentences</h3>
            <input type="number" id="edit-sentence-id" placeholder="Enter sentence ID">
            <button class="btn btn-secondary" onclick="loadSentenceForEdit()">Load Sentence</button>
            <button class="btn btn-danger" onclick="deleteSentence()">Delete</button>
            <div id="edit-sentence-form" style="display: none; margin-top: 10px;">
                <input type="text" id="edit-sentence-english" placeholder="English">
                <input type="text" id="edit-sentence-french" placeholder="French">
                <input type="text" id="edit-sentence-shuffled" placeholder="Shuffled">
                <input type="number" id="edit-sentence-category-id" placeholder="Category ID">
                <button class="btn" onclick="updateSentence()">Update Sentence</button>
            </div>
        </div>
        <div id="edit-sentence-results" class="results" style="display: none;"></div>
    `;
}

function displaySentencesTable(sentences) {
    const container = document.getElementById('sentences-display');
    container.innerHTML = `
        <table class="word-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>English</th>
                    <th>French</th>
                    <th>Shuffled</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sentences.map(s => `
                    <tr>
                        <td>${s.sentence_id}</td>
                        <td>${s.english}</td>
                        <td>${s.french}</td>
                        <td>${s.shuffled}</td>
                        <td>${s.category_name}</td>
                        <td>
                            <button class="btn action-btn" onclick="openModal('edit-sentences'); setTimeout(() => { document.getElementById('edit-sentence-id').value = ${s.sentence_id}; loadSentenceForEdit(); }, 100)">Edit</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
    

// API and Data Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Category and Word Logic
async function loadCategoriesForEdit() {
    const data = await apiCall('/categories');
    if (data.success) {
        currentCategories = data.data;
        populateSelects();
        displayCategoriesList();
    }
}

async function createCategory() {
    const name = document.getElementById('new-category-name').value.trim();
    if (!name) return alert('Please enter a category name');
    const data = await apiCall('/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: name })
    });
    if (data.success) {
        document.getElementById('new-category-name').value = '';
        loadCategoriesForEdit();
        showResult('add-category-results', 'Success');
    } else {
        showResult('add-category-results', data, true);
    }
}

async function deleteCategoryFrontend() {
    const select = document.getElementById('delete-category-select');
    const categoryId = select.value;
    if (!categoryId) return alert('Please select a category to delete');
    if (!confirm('Are you sure you want to delete this category and all its words?')) return;
    const data = await apiCall(`/categories/${categoryId}`, { method: 'DELETE' });
    if (data.success) {
        select.value = '';
        loadCategoriesForEdit();
        showResult('delete-category-results', 'Success');
    } else {
        showResult('delete-category-results', data, true);
    }
}

async function createWord() {
    const english = document.getElementById('new-english').value.trim();
    const french = document.getElementById('new-french').value.trim();
    const categoryId = document.getElementById('new-word-category').value;
    if (!english || !french || !categoryId) return alert('Please fill in all fields');
    const data = await apiCall('/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang1Word: english, lang2Word: french, categoryId: parseInt(categoryId) })
    });
    if (data.success) {
        ['new-english', 'new-french', 'new-word-category'].forEach(id => document.getElementById(id).value = '');
        showResult('add-word-results', 'Success');
    } else {
        showResult('add-word-results', data, true);
    }
}

async function loadCurrentWords() {
    const category = document.getElementById('filter-category')?.value || '';
    const endpoint = category ? `/vocab?category=${category}` : '/vocab';
    const data = await apiCall(endpoint);
    if (data.success) {
        const wordsData = Array.isArray(data.data) ?
            { words: data.data, totalCount: data.data.length, currentPage: 1, totalPages: 1 } :
            data.data;
        displayWordsTable(wordsData);
    } else {
        showResult('words-display', data, true);
    }
}

async function loadWordForEdit() {
    const wordId = document.getElementById('edit-word-id').value;
    if (!wordId) return alert('Please enter a word ID');
    const data = await apiCall(`/vocab/${wordId}`);
    if (data.success) {
        const word = data.data;
        document.getElementById('edit-english').value = word.lang1_word;
        document.getElementById('edit-french').value = word.lang2_word;
        document.getElementById('edit-category-id').value = word.category_id;
        document.getElementById('edit-word-form').style.display = 'block';
    } else {
        showResult('edit-results', data, true);
    }
}

async function updateWord() {
    const wordId = document.getElementById('edit-word-id').value;
    const english = document.getElementById('edit-english').value.trim();
    const french = document.getElementById('edit-french').value.trim();
    const categoryId = document.getElementById('edit-category-id').value;
    if (!wordId || !english || !french || !categoryId) return alert('Please fill in all fields');
    const data = await apiCall(`/vocab/${wordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang1Word: english, lang2Word: french, categoryId: parseInt(categoryId) })
    });
    if (data.success) {
        document.getElementById('edit-word-form').style.display = 'none';
        document.getElementById('edit-word-id').value = '';
        showResult('edit-results', 'Success');
    } else {
        showResult('edit-results', data, true);
    }
}

async function deleteWord() {
    const wordId = document.getElementById('edit-word-id').value;
    if (!wordId) return alert('Please enter a word ID');
    if (!confirm('Are you sure you want to delete this word?')) return;
    const data = await apiCall(`/vocab/${wordId}`, { method: 'DELETE' });
    if (data.success) {
        document.getElementById('edit-word-id').value = '';
        document.getElementById('edit-word-form').style.display = 'none';
        showResult('edit-results', 'Success');
    } else {
        showResult('edit-results', data, true);
    }
}

function displayWordsTable(data) {
    const container = document.getElementById('words-display');
    const selectedCategory = document.getElementById('filter-category')?.value || '';
    const showCategoryColumn = !selectedCategory;

    const headerText = data.totalPages > 1 ?
        `Words (Page ${data.currentPage} of ${data.totalPages}) - Total: ${data.totalCount}` :
        `All Words - Total: ${data.totalCount}`;

    container.innerHTML = `
        <h4>${headerText}</h4>
        <table class="word-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>English</th>
                    <th>French</th>
                    ${showCategoryColumn ? '<th>Category</th>' : ''}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${data.words.map(word => `
                    <tr>
                        <td>${word.vocab_id}</td>
                        <td>${word.lang1_word}</td>
                        <td>${word.lang2_word}</td>
                        ${showCategoryColumn ? `<td>${word.category_name}</td>` : ''}
                        <td>
                            <button class="btn action-btn" onclick="openModal('edit-words'); setTimeout(() => { document.getElementById('edit-word-id').value = ${word.vocab_id}; loadWordForEdit(); }, 100)">Edit</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function displayCategoriesList() {
    const container = document.getElementById('categories-list');
    container.innerHTML = `
        <h4>Current Categories:</h4>
        <ul>
            ${currentCategories.map(cat => `<li>${cat.category_name} (${cat.word_count} words)</li>`).join('')}
        </ul>
    `;
}

function populateSelects() {
    [
        'filter-category',
        'new-word-category',
        'edit-word-category',
        'delete-category-select',
        'new-sentence-category'
    ].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const firstOption = select.children[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            currentCategories.forEach(cat => {
                select.add(new Option(cat.category_name, cat.category_id));
            });
        }
    });
}

// Sentence logic (create, edit, delete, load)
async function loadSentences() {
    const data = await apiCall('/sentences');
    if (data.success) {
        displaySentencesTable(data.data);
    } else {
        showResult('sentences-display', data, true);
    }
}

async function createSentence() {
    const english = document.getElementById('new-sentence-english').value.trim();
    const french = document.getElementById('new-sentence-french').value.trim();
    const shuffled = document.getElementById('new-sentence-shuffled').value.trim();
    const categoryId = document.getElementById('new-sentence-category').value;
    if (!english || !french || !shuffled || !categoryId) return alert('Please fill in all fields');
    const data = await apiCall('/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english, french, shuffled, categoryId: parseInt(categoryId) })
    });
    if (data.success) {
        ['new-sentence-english', 'new-sentence-french', 'new-sentence-shuffled', 'new-sentence-category'].forEach(id => document.getElementById(id).value = '');
        showResult('add-sentence-results', 'Success');
        loadSentences();
    } else {
        showResult('add-sentence-results', data, true);
    }
}

async function loadSentenceForEdit() {
    const sentenceId = document.getElementById('edit-sentence-id').value;
    if (!sentenceId) return alert('Please enter a sentence ID');
    const data = await apiCall(`/sentences/${sentenceId}`);
    if (data.success) {
        const s = data.data;
        document.getElementById('edit-sentence-english').value = s.english;
        document.getElementById('edit-sentence-french').value = s.french;
        document.getElementById('edit-sentence-shuffled').value = s.shuffled;
        document.getElementById('edit-sentence-category-id').value = s.category_id;
        document.getElementById('edit-sentence-form').style.display = 'block';
    } else {
        showResult('edit-sentence-results', data, true);
    }
}

async function updateSentence() {
    const sentenceId = document.getElementById('edit-sentence-id').value;
    const english = document.getElementById('edit-sentence-english').value.trim();
    const french = document.getElementById('edit-sentence-french').value.trim();
    const shuffled = document.getElementById('edit-sentence-shuffled').value.trim();
    const categoryId = document.getElementById('edit-sentence-category-id').value;
    if (!sentenceId || !english || !french || !shuffled || !categoryId) return alert('Please fill in all fields');
    const data = await apiCall(`/sentences/${sentenceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english, french, shuffled, categoryId: parseInt(categoryId) })
    });
    if (data.success) {
        document.getElementById('edit-sentence-form').style.display = 'none';
        document.getElementById('edit-sentence-id').value = '';
        showResult('edit-sentence-results', 'Success');
        loadSentences();
    } else {
        showResult('edit-sentence-results', data, true);
    }
}

async function deleteSentence() {
    const sentenceId = document.getElementById('edit-sentence-id').value;
    if (!sentenceId) return alert('Please enter a sentence ID');
    if (!confirm('Are you sure you want to delete this sentence?')) return;
    const data = await apiCall(`/sentences/${sentenceId}`, { method: 'DELETE' });
    if (data.success) {
        document.getElementById('edit-sentence-id').value = '';
        document.getElementById('edit-sentence-form').style.display = 'none';
        showResult('edit-sentence-results', 'Success');
        loadSentences();
    } else {
        showResult('edit-sentence-results', data, true);
    }
}

function displaySentencesTable(sentences) {
    const container = document.getElementById('sentences-display');
    container.innerHTML = `
        <table class="word-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>English</th>
                    <th>French</th>
                    <th>Shuffled</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                ${sentences.map(s => `
                    <tr>
                        <td>${s.sentence_id}</td>
                        <td>${s.english}</td>
                        <td>${s.french}</td>
                        <td>${s.shuffled}</td>
                        <td>${s.category_name}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Result Display Helper
function showResult(id, messageOrResponse, isError = false) {
    const container = document.getElementById(id);
    const msg = typeof messageOrResponse === 'string'
        ? messageOrResponse
        : messageOrResponse.error || JSON.stringify(messageOrResponse);
    container.textContent = msg;
    container.style.color = isError ? 'red' : 'green';
    container.style.display = 'block';
}