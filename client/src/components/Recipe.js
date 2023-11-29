import React, { useEffect, useState } from "react";
import Axios from 'axios' //  I'm not sure if we need Axios
//import {useHistory} from "react-router-dom"

function Recipe() {
  const [data, setData] = useState([])
  useEffect(()=>{
//  Accesses DB info through backend server
    fetch('http://localhost:8081/recipes')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])
  return(
    <>
      <p>Hello these are all the recipies in the database!</p>
      <table>
        <thead>
          <tr>
            <th>
              Recipe
            </th>
            <th>
              Author
            </th>
            <th>
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.recipe_name}</td>
              <td>{d.attribution}</td>
              <td>{d.classification}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Here are your favorite recipes!</p>
    </>
  )
};

export default Recipe;