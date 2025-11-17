// routes/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'recipes.json');

// ---------- helpers ----------
function readRecipes() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading recipes.json:', err);
    return [];
  }
}

function writeRecipes(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

// ---------- HOME + SEARCH + VIEW MODE ----------
router.get('/', (req, res) => {
  const allRecipes = readRecipes();

  const searchQuery = (req.query.q || '').trim();
  const searchLower = searchQuery.toLowerCase();
  const viewMode = (req.query.view || 'dashboard').toLowerCase(); // 'dashboard' or 'list'

  let recipes = allRecipes;

  if (searchQuery.length > 0) {
    recipes = allRecipes.filter(r =>
      (r.name && r.name.toLowerCase().includes(searchLower)) ||
      (r.ingredients && r.ingredients.toLowerCase().includes(searchLower)) ||
      (r.notes && r.notes.toLowerCase().includes(searchLower))
    );
  }

  res.render('index', {
    title: 'RecipeCraft',
    recipes,
    searchQuery,
    viewMode
  });
});

// ---------- CREATE ----------
router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create Recipe',
    searchQuery: ''
  });
});

router.post('/create', (req, res) => {
  const recipes = readRecipes();

  const newRecipe = {
    id: Date.now().toString(),
    name: req.body.name,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    time: req.body.time,
    equipment: req.body.equipment,
    image: req.body.image,
    notes: req.body.notes
  };

  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.redirect('/');
});

// ---------- EDIT ----------
router.get('/edit/:id', (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === req.params.id);

  if (!recipe) return res.redirect('/');

  res.render('edit', {
    title: 'Edit Recipe',
    recipe,
    searchQuery: ''
  });
});

router.post('/edit/:id', (req, res) => {
  const recipes = readRecipes();
  const idx = recipes.findIndex(r => r.id === req.params.id);

  if (idx === -1) return res.redirect('/');

  recipes[idx] = {
    ...recipes[idx],
    name: req.body.name,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    time: req.body.time,
    equipment: req.body.equipment,
    image: req.body.image,
    notes: req.body.notes
  };

  writeRecipes(recipes);
  res.redirect('/');
});

// ---------- DELETE ----------
router.post('/delete/:id', (req, res) => {
  let recipes = readRecipes();
  recipes = recipes.filter(r => r.id !== req.params.id);
  writeRecipes(recipes);
  res.redirect('/');
});

// ---------- READ-ONLY VIEW ONE RECIPE ----------
router.get('/view/:id', (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === req.params.id);

  if (!recipe) {
    return res.redirect('/?view=list');
  }

  res.render('recipe-view', {
    title: recipe.name ? `${recipe.name} | View Recipe` : 'View Recipe',
    searchQuery: '',
    recipe
  });
});

// ---------- ABOUT ----------
router.get('/about', (req, res) => {
  const allRecipes = readRecipes();
  res.render('about', {
    title: 'About RecipeCraft',
    searchQuery: '',
    recipes: allRecipes
  });
});

// ---------- CONTACT ----------
router.get('/contact', (req, res) => {
  const sent = req.query.sent === '1';
  const allRecipes = readRecipes();
  res.render('contact', {
    title: 'Contact RecipeCraft',
    searchQuery: '',
    submitted: sent,
    recipes: allRecipes
  });
});

router.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.redirect('/contact?sent=1');
});

module.exports = router;
