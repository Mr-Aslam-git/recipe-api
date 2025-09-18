const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express(); // <-- you must have this line before any app.get/app.post
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// location of the data file
const dataFile = path.join(__dirname, 'data', 'recipes.json');

// GET all recipes
app.get('/api/recipes', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    const recipes = JSON.parse(data);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Invalid JSON in recipes file' });
  }
});

// POST new recipe
app.post('/api/recipes', (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const data = fs.readFileSync(dataFile, 'utf-8');
    const recipes = JSON.parse(data);

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients,
      instructions,
      difficulty: 'medium'
    };

    recipes.push(newRecipe);
    fs.writeFileSync(dataFile, JSON.stringify(recipes, null, 2));

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Could not save recipe' });
  }
});

// root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
