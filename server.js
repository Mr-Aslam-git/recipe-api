app.post('/api/recipes', (req, res) => {
  try {
    const { title, ingredients, instructions, cookTime } = req.body;

    // Check required fields
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
      cookTime: cookTime || '15 minutes',
      difficulty: 'medium'
    };

    recipes.push(newRecipe);
    fs.writeFileSync(dataFile, JSON.stringify(recipes, null, 2));

    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Could not save recipe' });
  }
});

app.get('/api/recipes', (req, res) => {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    const recipes = JSON.parse(data);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Could not read recipes' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});