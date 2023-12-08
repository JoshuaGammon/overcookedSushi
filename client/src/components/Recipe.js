import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//import Axios from 'axios' //  I'm not sure if we need Axios
//import RecipeEntry from "./recipeEntry";
//import {useHistory} from "react-router-dom"

function Recipe() {
  const [data, setData] = useState([])
  const [favs, setFavs] = useState([])
  useEffect(()=>{
//  Accesses DB info through backend server
    fetch('http://localhost:8081/recipes')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));

    fetch('http://localhost:8081/favorites')
    .then(res => res.json())
    .then(favs => setFavs(favs))
    .catch(err => console.log(err));
  }, []);

  const navigate = useNavigate();

  const viewRecipe=(id, name, servings, steps, attribution)=>{
    console.log(servings);
    navigate('/recipes/'+ name, {state:{recipe_id: id, recipe_name: name, recipe_count: servings, recipe_steps: steps, recipe_author: attribution}})
  }


  return(
    <>
      <p>Hello these are all the recipies in the database!</p>
      <table>
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Author</th>
            <th>Type</th>
            <th>Click to View More</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.recipe_name}</td>
              <td>{d.attribution}</td>
              <td>{d.classification}</td>
              <td> 
                <button onClick={() => viewRecipe(d.recipe_id, d.recipe_name, d.servings, d.steps, d.attribution)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Here are your favorite recipes!</p>
      <table>
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Author</th>
            <th>Type</th>
            <th>Click to View More</th>
          </tr>
        </thead>
        <tbody>
          {favs.map((f, i) => (
            <tr key={i}>
              <td>{f.recipe_name}</td>
              <td>{f.attribution}</td>
              <td>{f.classification}</td>
              <td> 
                <button onClick={() => viewRecipe(f.recipe_id, f.recipe_name, f.servings, f.steps, f.attribution)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
};

export default Recipe;