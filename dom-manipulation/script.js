// Initial data: an array of quote objects. Each object has a text, category, and author.
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration", author: "Eleanor Roosevelt" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Value", author: "Albert Einstein" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life", author: "John Lennon" }
];

// Get references to all the important DOM elements
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

// Function to update the category filter dropdown
function updateCategoryFilter() {
  // Get all unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];
  // Clear existing options, but keep "All Categories"
  categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';
  // Dynamically add a new option for each category
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
}

// Function to display a random quote from the filtered list
function showRandomQuote() {
  // Get the currently selected category from the dropdown
  const selectedCategory = categoryFilterEl.value;
  let filteredQuotes;

  // Filter the quotes array based on the selected category
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  // Check if there are any quotes to display
  if (filteredQuotes.length === 0) {
    quoteTextEl.textContent = "No quotes available for this category.";
    quoteAuthorEl.textContent = "";
    return;
  }

  // Select a random quote from the filtered array
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  // Update the DOM elements with the new quote's text and author
  quoteTextEl.textContent = `"${randomQuote.text}"`;
  quoteAuthorEl.textContent = `- ${randomQuote.author}`;
}

// Function to add a new quote from the form
function addQuote() {
  const text = newQuoteTextEl.value.trim();
  const category = newQuoteCategoryEl.value.trim();
  const author = newQuoteAuthorEl.value.trim() || 'Unknown'; // Default to 'Unknown' if no author is provided

  // Check if the required fields are filled
  if (text === "" || category === "") {
    alert("Please enter both the quote and a category.");
    return;
  }

  // Create the new quote object
  const newQuote = {
    text: text,
    category: category,
    author: author
  };

  // Add the new quote to the array
  quotes.push(newQuote);
  
  // Update the UI
  updateCategoryFilter();
  showRandomQuote();
  
  // Reset the form fields and hide the form
  newQuoteTextEl.value = "";
  newQuoteCategoryEl.value = "";
  newQuoteAuthorEl.value = "";
  addQuoteFormContainer.classList.add('hidden');
}

// Add event listeners to the buttons and dropdown
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilterEl.addEventListener('change', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
showFormBtn.addEventListener('click', () => {
  addQuoteFormContainer.classList.toggle('hidden');
});

// Initial setup when the page loads
updateCategoryFilter();
showRandomQuote();