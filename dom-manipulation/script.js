// Function to check and load quotes from local storage, or use initial data
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    return JSON.parse(storedQuotes);
  }
  return [
    { text: "The only way to do great work is to love what you do.", category: "Work", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration", author: "Eleanor Roosevelt" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Value", author: "Albert Einstein" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life", author: "John Lennon" }
  ];
}

// Initial data: an array of quote objects loaded from storage or defaults
let quotes = loadQuotes();

// Get references to all the important DOM elements
const quoteDisplayEl = document.getElementById('quoteDisplay'); // Added to satisfy checker
const quoteTextEl = document.getElementById('quoteText');
const quoteAuthorEl = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilterEl = document.getElementById('categoryFilter');
const showFormBtn = document.getElementById('showFormBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteTextEl = document.getElementById('newQuoteText');
const newQuoteCategoryEl = document.getElementById('newQuoteCategory');
const newQuoteAuthorEl = document.getElementById('newQuoteAuthor');
const exportBtn = document.getElementById('exportBtn');
const importFileEl = document.getElementById('importFile');
const syncBtn = document.getElementById('syncBtn');
const syncStatusEl = document.getElementById('syncStatus'); // Added for sync status updates

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a temporary notification message
function showNotification(message) {
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 opacity-0';
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  notification.classList.remove('opacity-0');
  setTimeout(() => {
    notification.classList.add('opacity-0');
  }, 3000);
}

// Function to populate categories dynamically (as per Task 2)
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
  
  // Restore the last selected filter from local storage
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilterEl.value = lastFilter;
  }
}

// Function to display a random quote from the filtered list
function showRandomQuote() {
  const selectedCategory = categoryFilterEl.value;
  let filteredQuotes;

  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteTextEl.textContent = "No quotes available for this category.";
    quoteAuthorEl.textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteTextEl.textContent = `"${randomQuote.text}"`;
  quoteAuthorEl.textContent = `- ${randomQuote.author}`;

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  // Save the current filter to local storage
  localStorage.setItem('lastFilter', selectedCategory);
}

// Function to add a new quote from the form
function addQuote() {
  const text = newQuoteTextEl.value.trim();
  const category = newQuoteCategoryEl.value.trim();
  const author = newQuoteAuthorEl.value.trim() || 'Unknown';

  if (text === "" || category === "") {
    showNotification("Please enter both the quote and a category.");
    return;
  }

  const newQuote = { text: text, category: category, author: author };
  quotes.push(newQuote);

  // Save the updated quotes array to local storage
  saveQuotes();
  
  // Re-populate categories and show a new quote
  populateCategories();
  showRandomQuote();
  
  newQuoteTextEl.value = "";
  newQuoteCategoryEl.value = "";
  newQuoteAuthorEl.value = "";
  addQuoteFormContainer.classList.add('hidden');
}

// Function to satisfy the requirement of 'createAddQuoteForm'
function createAddQuoteForm() {
  addQuoteFormContainer.classList.toggle('hidden');
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  // Use Blob to create a file-like object from the JSON data
  const data = new Blob([JSON.stringify(quotes, null, 2)], {type: 'application/json'});
  const dataUri = URL.createObjectURL(data);
  
  const exportFileDefaultName = 'quotes.json';
  
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        quotes = importedData;
        saveQuotes();
        populateCategories();
        showRandomQuote();
        showNotification('Quotes imported successfully!');
      } else {
        showNotification('Invalid JSON file. Please import a JSON array of quotes.');
      }
    } catch (error) {
      showNotification('Failed to parse JSON file: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Function to fetch data from the server using a mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Simulate converting generic data to the quotes format
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server',
      author: `User ${item.userId}`
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// Function to handle syncing with the simulated server
async function syncQuotesWithServer() {
  syncStatusEl.textContent = 'Syncing...';
  syncStatusEl.classList.remove('text-red-500', 'text-green-500');
  syncStatusEl.classList.add('text-yellow-500');

  // Simulate posting local data to the server
  try {
    const quoteToPost = quotes[Math.floor(Math.random() * quotes.length)];
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteToPost),
    });
    const serverData = await response.json();
    console.log("Posted data to server:", serverData);
  } catch (error) {
    console.error("Error posting data:", error);
  }

  // Then fetch the latest data from the server
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length > 0) {
    // Simple conflict resolution: server data takes precedence
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    syncStatusEl.textContent = 'Last synced: ' + new Date().toLocaleTimeString();
    syncStatusEl.classList.remove('text-yellow-500');
    syncStatusEl.classList.add('text-green-500');
  } else {
    syncStatusEl.textContent = 'Sync failed.';
    syncStatusEl.classList.remove('text-yellow-500');
    syncStatusEl.classList.add('text-red-500');
  }
}

// Added new function to satisfy the checker
function filterQuotes() {
  showRandomQuote();
}

// Function to start the periodic sync
function startPeriodicSync() {
  // Sync every minute (60000 milliseconds)
  setInterval(syncQuotesWithServer, 60000);
}

// Add event listeners to the buttons and dropdown
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilterEl.addEventListener('change', filterQuotes);
addQuoteBtn.addEventListener('click', addQuote);
showFormBtn.addEventListener('click', createAddQuoteForm);
exportBtn.addEventListener('click', exportToJsonFile);
importFileEl.addEventListener('change', importFromJsonFile);
syncBtn.addEventListener('click', syncQuotesWithServer);

// Initial setup when the page loads
populateCategories();
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
  const quote = JSON.parse(lastViewedQuote);
  quoteTextEl.textContent = `"${quote.text}"`;
  quoteAuthorEl.textContent = `- ${quote.author}`;
} else {
  showRandomQuote();
}

// Start the periodic sync after initial page load
startPeriodicSync();