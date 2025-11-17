// public/javascripts/main.js
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('navSearch');
  const suggestionsBox = document.getElementById('searchSuggestions');

  if (!searchInput || !suggestionsBox) return;

  const allRecipes = Array.isArray(window.recipeSuggestions)
    ? window.recipeSuggestions
    : [];

  function clearSuggestions() {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
  }

  // Show Google-style suggestions while typing
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim().toLowerCase();
    clearSuggestions();

    if (!query) return;

    const matches = allRecipes
      .filter(r => r.name && r.name.toLowerCase().includes(query))
      .slice(0, 6);

    if (matches.length === 0) return;

    matches.forEach(recipe => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'search-suggestion-item';
      item.textContent = recipe.name;

      // CLICKING SUGGESTION: perform a normal search (like pressing Enter)
      item.addEventListener('click', function () {
        searchInput.value = recipe.name;       // put text in box
        const form = searchInput.closest('form');
        if (form) form.submit();               // submit GET /?q=...
      });

      suggestionsBox.appendChild(item);
    });

    suggestionsBox.style.display = 'block';
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', function (e) {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      clearSuggestions();
    }
  });

  // ESC key hides suggestions; Enter is left alone (normal submit)
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      clearSuggestions();
    }
  });
});
