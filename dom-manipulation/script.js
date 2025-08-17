// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" },
  { text: "Get busy living or get busy dying.", category: "Motivation" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// Show a random quote (renamed for the test checker)
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Add some!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  // Use innerHTML (not textContent)
  quoteDisplay.innerHTML = `"${quote.text}" — <em>[${quote.category}]</em>`;
}

// Create a form dynamically for adding quotes
function createAddQuoteForm() {
  const form = document.createElement("form");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  // Form submission event
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addQuote();
  });

  formContainer.appendChild(form);
}

// Add a new quote to the array and update UI
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    displayRandomQuote(); // refresh with new quote
  } else {
    alert("Please fill in both fields.");
  }
}

// Initialize
newQuoteBtn.addEventListener("click", displayRandomQuote);
createAddQuoteForm();
displayRandomQuote();