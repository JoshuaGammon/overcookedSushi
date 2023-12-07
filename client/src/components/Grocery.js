import React, { useEffect, useState } from "react";

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
        <p>Hello, this is your grocery list!</p>
        <div>
          <table>
            <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Unit Type</th>
            </thead>
            <tbody>
              {data.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowData.ingredient_id}</td>
                  <td>{rowData.ingredient_name}</td>
                  <td>{rowData.quantity_numerator/rowData.quantity_denominator}</td>
                  <td>{rowData.measurement_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
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
  .catch(err => console.log(err));
};

export default Grocery;