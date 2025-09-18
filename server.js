const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dataFilePath = path.join(__dirname, 'data', 'recipes.json');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Helper function to read recipes from file
function readRecipes() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write recipes to file
function writeRecipes(recipes) {
  fs.writeFileSync(dataFilePath, JSON.stringify(recipes, null, 2));
}

// POST /api/recipes - Add a new recipe
app.post('/api/recipes', (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Title, ingredients, and instructions are required.' });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime: cookTime || '',
    difficulty: difficulty || 'medium',
  };

  const recipes = readRecipes();
  recipes.push(newRecipe);
  writeRecipes(recipes);

  res.status(201).json(newRecipe);
});

// GET /api/recipes - Get all recipes
app.get('/api/recipes', (req, res) => {
  try {
    const recipes = readRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read recipes' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});