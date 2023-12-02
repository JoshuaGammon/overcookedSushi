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
              <th>Unit type</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
              <td>{d.ingredient_id}</td>
              <td>{d.ingredient_name}</td>
              <td>{(d.quantity_numerator/d.quantity_denominator)}</td>
              <td>{d.measurement_type}</td>
            </tr>
            ))}
          </tbody>
        </table>
    </div>
    </>
  )
};

export default Pantry;