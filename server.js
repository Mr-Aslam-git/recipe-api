const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = './recipes.json';

// Middleware to parse JSON
app.use(express.json());

// Helper function to read recipes from file
const readRecipes = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty array if file doesn't exist or is invalid
  }
};

// Helper function to write recipes to file
const writeRecipes = (recipes) => {
  fs.writeFileSync(dataFile, JSON.stringify(recipes, null, 2));
};

// GET all recipes
app.get('/api/recipes', (req, res) => {
  const recipes = readRecipes();
  res.json(recipes);
});

// POST a new recipe
app.post('/api/recipes', (req, res) => {
  const { title, ingredients, instructions } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Please provide title, ingredients, and instructions' });
  }

  const recipes = readRecipes();

  const newRecipe = {
    id: recipes.length + 1,
    title,
    ingredients,
    instructions
  };

  recipes.push(newRecipe);
  writeRecipes(recipes);

  res.status(201).json(newRecipe);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
