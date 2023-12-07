import React, { useEffect, useState } from 'react';

function NewRecipe() {
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState('');
  const [steps, setSteps] = useState('');
  const [classification, setClassification] = useState('');
  const [attribution, setAttribution] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient_id: '', quantity: '', unit: '' }]); //ingredient info that gets sent to post

  const [allIngredients, setData] = useState([]) //list of ingredient's names and ids for drop down
  useEffect(() => {
    fetch('http://localhost:8081/allIngredients')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient_id: '', quantity: '', unit: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/createRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeName,
          servings,
          steps,
          classification,
          attribution,
          ingredients,
        }),
      });

      if (response.ok) {
        console.log('Recipe added successfully!');
      } else {
        console.error('Failed to add recipe');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ingredientNames = allIngredients //maybe unecessary but it's leftover from a previous thing and I'm scared to change names lol
  const unitOptions = ['Cup(s)', 'Ounce(s)', 'Tablespoon(s)', 'Teaspoon(s)', 'Pound(s)'];
  return (
    <div>
      <h2>Add a Recipe</h2>
      <form onSubmit={handleSubmit}>
        <h3>Basic Information</h3> 
        <label>
          Recipe Name:
          <input type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required/>
        </label>
        <br />
        <label>
          Servings:
          <input type="text" value={servings} onChange={(e) => setServings(e.target.value)} required/>
        </label>
        <br />
        <label>
          Classification:
          <input
            type="text"
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Attribution:
          <input type="text" value={attribution} onChange={(e) => setAttribution(e.target.value)} required/>
        </label>
        <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
            <div key={index}>
                <label>
                Ingredient Name:
                <select
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'ingredient_id', e.target.value)}
                    required
                >
                    <option value="" disabled>Select an ingredient</option>
                    {ingredientNames.map((ingredient, i) => (
                    <option key={i} value={ingredient.ingredient_id}>{ingredient.ingredient_name}</option>
                    ))}
                </select>
                </label>
                <label>
                Quantity:
                <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    required
                />
                </label>
                <label>
                Unit:
                <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    required
                >
                    <option value="" disabled>Select a unit</option>
                    {unitOptions.map((unit, i) => (
                    <option key={i} value={unit}>{unit}</option>
                    ))}
                </select>
                <br></br>
                </label>
                {index === ingredients.length - 1 && (
                <button type="button" onClick={handleAddIngredient}>
                    + New Ingredient
                </button>
                )}
            </div>
            ))}
        <br />
        <h3>Steps</h3>
        <label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} required/>
        </label>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewRecipe;
