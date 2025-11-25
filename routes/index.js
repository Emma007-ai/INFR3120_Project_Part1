// routes/index.js
const express = require('express');
const router  = express.Router();
const Recipe  = require('../data/recipes');

// ---------- HOME + SEARCH + VIEW MODE ----------
router.get('/', async (req, res) => {
  try {
    const searchQuery = (req.query.q || '').trim();
    const viewMode    = (req.query.view || 'dashboard').toLowerCase(); // 'dashboard' or 'list'

    let recipes = [];

    if (searchQuery.length > 0) {
      const regex = new RegExp(searchQuery, 'i'); // case-insensitive
      recipes = await Recipe.find({
        $or: [
          { name: regex },
          { ingredients: regex },
          { notes: regex },
        ],
      }).sort({ createdAt: -1 });
    } else {
      recipes = await Recipe.find().sort({ createdAt: -1 });
    }

    res.render('index', {
      title: 'RecipeCraft',
      recipes,
      searchQuery,
      viewMode,
    });
  } catch (err) {
    console.error('Error loading recipes:', err);
    res.render('index', {
      title: 'RecipeCraft',
      recipes: [],
      searchQuery: '',
      viewMode: 'dashboard',
      error: 'Could not load recipes right now.',
    });
  }
});

// ---------- CREATE ----------
router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create Recipe',
    searchQuery: '',
  });
});

router.post('/create', async (req, res) => {
  try {
    const newRecipe = {
      id: Date.now().toString(), // custom id field
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      time: req.body.time,
      equipment: req.body.equipment,
      image: req.body.image,
      notes: req.body.notes,
    };

    await Recipe.create(newRecipe);
    res.redirect('/');
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.redirect('/');
  }
});

// ---------- EDIT ----------
router.get('/edit/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);   // FIXED

    if (!recipe) return res.redirect('/');

    res.render('edit', {
      title: 'Edit Recipe',
      recipe,
      searchQuery: ''
    });
  } catch (err) {
    console.error('Error loading recipe for edit:', err);
    res.redirect('/');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const updated = {
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      time: req.body.time,
      equipment: req.body.equipment,
      image: req.body.image,
      notes: req.body.notes
    };

    await Recipe.findByIdAndUpdate(req.params.id, updated); // FIXED
    res.redirect('/');
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.redirect('/');
  }
});

// ---------- DELETE ----------
router.post('/delete/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);  // FIXED
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.redirect('/');
  }
});

// ---------- READ-ONLY VIEW ONE RECIPE ----------
router.get('/view/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id); // FIXED

    if (!recipe) return res.redirect('/?view=list');

    res.render('recipe-view', {
      title: recipe.name ? `${recipe.name} | View Recipe` : 'View Recipe',
      searchQuery: '',
      recipe
    });
  } catch (err) {
    console.error('Error viewing recipe:', err);
    res.redirect('/?view=list');
  }
});

// ---------- ABOUT ----------
router.get('/about', async (req, res) => {
  try {
    const allRecipes = await Recipe.find().sort({ createdAt: -1 });
    res.render('about', {
      title: 'About RecipeCraft',
      searchQuery: '',
      recipes: allRecipes,
    });
  } catch (err) {
    console.error('Error loading recipes for about page:', err);
    res.render('about', {
      title: 'About RecipeCraft',
      searchQuery: '',
      recipes: [],
    });
  }
});

// ---------- CONTACT ----------
router.get('/contact', async (req, res) => {
  try {
    const sent       = req.query.sent === '1';
    const allRecipes = await Recipe.find().sort({ createdAt: -1 });

    res.render('contact', {
      title: 'Contact RecipeCraft',
      searchQuery: '',
      submitted: sent,
      recipes: allRecipes,
    });
  } catch (err) {
    console.error('Error loading recipes for contact page:', err);
    res.render('contact', {
      title: 'Contact RecipeCraft',
      searchQuery: '',
      submitted: false,
      recipes: [],
    });
  }
});

router.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.redirect('/contact?sent=1');
});

module.exports = router;
