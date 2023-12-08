import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

function RecipeEntry() {
    const location = useLocation();
    let id = location.state.recipe_id;

    const [ingredients, setData] = useState([])
    const [isFavorite, setStatus] = useState([])
    useEffect(()=>{
        fetch('http://localhost:8081/recipes/' + id)
        .then(res => res.json())
        .then(ingredients => setData(ingredients))
        .catch(err => console.log(err));

        fetch('http://localhost:8081/checkIfFavorite/' + id)
        .then(res => res.json())
        .then(isFavorite => setStatus(isFavorite))
        .catch(err => console.log(err));
    }, [id]);

    const [count, setCount] = useState(0);
    useEffect(() => {   
        const pantryCount = ingredients.reduce((accumulator, currentItem) => {
            if (currentItem.pantry) {
                return accumulator + 1;
            }
            return accumulator;
        }, 0);

        setCount(pantryCount);
    }, [ingredients]);

    const percentage = Math.round(count / parseFloat(ingredients.length) * 100)
    const circle_specifics = percentage + ", 100"
    
    if(isFavorite){
      return(
        <>
            <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                        stroke-dasharray={circle_specifics}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{percentage}%</text>
                </svg>
            <h1 style={{textAlign:"center"}}>{location.state.recipe_name}</h1>
            <h3 style={{textAlign:"center"}}>{location.state.recipe_author}</h3>
            <h4 style={{textAlign:"center"}}>{location.state.recipe_count + " Servings"}</h4>
            <p>{location.state.recipe_steps}</p>
            <ul>
                {ingredients.map((d, i) => (
                    <li>
                        {d.pantry ? (
                            <p style={{color: "#4C814D"}}>{d.quantity_numerator}/{d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</p>
                        ) : (
                            <p style={{color: "red"}}>{d.quantity_numerator}/{d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</p>
                        )}
                            
                    </li>
                ))}
            </ul>
            <button onClick = {() => removeFromPantry(id)}>Mark as Cooked</button>
            <br></br>
            <br></br>
            <button onClick = {() => addToGroceryList(ingredients)}>Cook Later</button>
            <br></br>
            <br></br>
            <button onClick = {() => removeFromFavorites(id)}>Remove From Favorites</button>
        </>
    )
      
    }
    else {
      return(
        <>
            <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path class="circle"
                        stroke-dasharray={circle_specifics}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" class="percentage">{percentage}%</text>
                </svg>
            <h1 style={{textAlign:"center"}}>{location.state.recipe_name}</h1>
            <h3 style={{textAlign:"center"}}>{location.state.recipe_author}</h3>
            <h4 style={{textAlign:"center"}}>{location.state.recipe_count + " Servings"}</h4>
            <p>{location.state.recipe_steps}</p>
            <ul>
                {ingredients.map((d, i) => (
                    <li>
                        {d.pantry ? (
                            <p style={{color: "#4C814D"}}>{d.quantity_numerator}/{d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</p>
                        ) : (
                            <p style={{color: "red"}}>{d.quantity_numerator}/{d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</p>
                        )}
                            
                    </li>
                ))}
            </ul>
            <button onClick = {() => removeFromPantry(id)}>Mark as Cooked</button>
            <br></br>
            <br></br>
            <button onClick = {() => addToGroceryList(id, ingredients)}>Cook Later</button>
            <br></br>
            <br></br>
            <button onClick = {() => addToFavorites(id)}>Favorite Recipe</button>
        </>
    )
      
  }
};

function addToFavorites(id){
    fetch('http://localhost:8081/addToFavorites/' + id)
    .then(res => res.json())
    .catch(err => console.log(err));
};

function removeFromFavorites(id){
    fetch('http://localhost:8081/removeFromFavorites/' + id)
    .then(res => res.json())
    .catch(err => console.log(err));
};

function removeFromPantry(id){
    fetch('http://localhost:8081/removeIngredients/' + id)
    .then(res => res.json())
    .catch(err => console.log(err));
};

function addToGroceryList(ingredients){
    fetch('http://localhost:8081/addIngredients',{
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredients)
     })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export default RecipeEntry;