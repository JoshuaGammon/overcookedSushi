import React, { useEffect, useState } from "react";
import Axios from 'axios' //  I'm not sure if we need Axios
//import {useHistory} from "react-router-dom"

function Grocery() {
  const [data, setData] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/retrieveGrocery')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, []);

  if(data.length > 0) {
    return(
      <>
        <p>Hello this is your grocery list!</p>
        <div>
            {data.map((rowData, rowIndex) => (
                <table>
                  <thead>
                    <th>Ingredient Name</th>
                    <th>Quantity</th>
                    <th>Unit of Measurement</th>
                  </thead>
                  <tbody>
                    <tr key={rowIndex}>
                      <td>{rowData.ingredient_name}</td>
                      <td>{rowData.quantity_numerator + "/" + rowData.quantity_denominator}</td>
                      <td>{rowData.measurement_type}</td>
                    </tr>
                  </tbody>
                </table>
            ))}
        </div>
        <button onClick = {() => migrateGroceries()}>Mark Items as Bought</button>
      </>
    )
  }
  else {
    return(
      <>
        <p>Your grocery list is empty.</p>
      </>
    )
  }
};

function migrateGroceries() {
  fetch('http://localhost:8081/migrateGroceries')
  .then(res => res.json())
  .then(data => {
    if(data){
      console.log(data);
    }
    else {
      console.log("Failed to migrate groceries");
    }
  })
  .catch(err => console.log(err));
}

export default Grocery;