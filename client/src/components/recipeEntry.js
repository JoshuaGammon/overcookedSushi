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
    
    // const CheckPantry = (id) => {
    //     const [tmp, setTmp] = useState([])
    //     fetch('http://localhost:8081/pantry/'+ id)
    //     .then(res => res.json)
    //     .then(tmp => setTmp(tmp))
    //     .catch(err => console.log(err));

    //     if(tmp) return false;
    //     return true
    // }

    // let [haves, setHaves] = useState([])
    // ingredients.forEach((x) => {
    //     const [tmp, setTmp] = useState([])
    //     useEffect(()=>{
    //         fetch('http://localhost:8081/pantry/' + x.ingredient_id)
    //         .then(res => res.json())
    //         .then(tmp => setTmp(tmp))
    //         .then(setHaves({...haves, tmp}))
    //         .catch(err=>console.log(err));
    //     }, [id]);
    // })

    if(isFavorite){
        return(
            <>
                <h1>{location.state.recipe_name}</h1>
                <h3>{location.state.recipe_author}</h3>
                <h4>{location.state.recipe_count + " Servings"}</h4>
                <p>{location.state.recipe_steps}</p>
                <ul>
                    {ingredients.map((d, i) => (
                        <li>
                            <div>{d.quantity_numerator/d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</div>
                        </li>
                    ))}
                </ul>
                <button onClick = {() => addToGroceryList(id)}>Cook Later (Add All Ingredients)</button>
                <br></br>
                <br></br>
                <button onClick = {() => removeFromPantry(id)}>Mark as Cooked (Remove Ingredients You Have)</button>
                <br></br>
                <br></br>
                <button onClick = {() => removeFromFavorites(id)}>Remove From Favorites</button>
            </>
        )
    }
    else {
        return(
            <>
                <h1>{location.state.recipe_name}</h1>
                <h3>{location.state.recipe_author}</h3>
                <h4>{location.state.recipe_count + " Servings"}</h4>
                <p>{location.state.recipe_steps}</p>
                <ul>
                    {ingredients.map((d, i) => (
                        <li>
                            <div>{d.quantity_numerator/d.quantity_denominator} {d.measurement_type} {d.ingredient_name}</div>
                        </li>
                    ))}
                </ul>
                <button onClick = {() => addToGroceryList(id)}>Cook Later (Add All Ingredients)</button>
                <br></br>
                <br></br>
                <button onClick = {() => removeFromPantry(id)}>Mark as Cooked (Remove Ingredients You Have)</button>
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

function addToGroceryList(id){
    fetch('http://localhost:8081/addIngredients/' + id)
    .then(res => res.json())
    .catch(err => console.log(err));
};

export default RecipeEntry;