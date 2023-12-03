import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

function RecipeEntry() {
    const location = useLocation();
    let id = location.state.recipe_id;

    const [ingredients, setData] = useState([])
    useEffect(()=>{
      fetch('http://localhost:8081/recipes/'+ id)
      .then(res => res.json())
      .then(ingredients => setData(ingredients))
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

    return(
        <>
            <h1>{location.state.recipe_name}</h1>
            <h3>{location.state.recipe_author}</h3>
            <h4>{location.state.recipe_count}</h4>
            <p>{location.state.recipe_steps}</p>
            <ul>
                {ingredients.map((d, i) => (
                    <li>
                        <div>{d.quantity_numerator}/{d.quantity_denominator}</div>
                        <div>{d.measurement_type}</div>
                        <div>{d.ingredient_name}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default RecipeEntry;