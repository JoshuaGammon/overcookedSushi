import React, { useEffect, useState } from "react";
import '../App.css'

function Pantry() {
  const [data, setData] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/pantryItems')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

  if(data.length > 0){
    return(
      <>
        <p>Hello, this is your pantry!</p>
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Unit Type</th>
                <th>Date Bought</th>
                <th>Remove From Pantry</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                <td>{d.ingredient_id}</td>
                <td>{d.ingredient_name}</td>
                <td>{(d.quantity_numerator/d.quantity_denominator)}</td>
                <td>{d.measurement_type}</td>
                <td>{d.bought_date.toString().slice(0,10)}</td>
                <td>
                  <button onClick = {() => deleteFromPantry(d.ingredient_id)}>Remove From Pantry</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
      </div>
      </>
    )
  }
  else{
    return(
      <>
        <p>Your pantry is empty.</p>
      </>
    )
  }
  
};

function deleteFromPantry(id){
  fetch('http://localhost:8081/deleteFromPantry/' + id)
  .then(res => res.json())
  .catch(err => console.log(err));

  //Force page refresh
}

export default Pantry;