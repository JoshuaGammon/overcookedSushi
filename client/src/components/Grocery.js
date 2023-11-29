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
  }, [])

  return(
    <>
      <p>Hello this is your grocery list!</p>
      <table>
        <thead>
          <th>Ingredient Name</th>
          <th>Quantity</th>
          <th>Unit of Measurement</th>
        </thead>
        <tbody>
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowData.ingredient_name}</td>
              <td>{rowData.quantity_numerator + "/" + rowData.quantity_denominator}</td>
              <td>{rowData.measurement_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
};

export default Grocery;