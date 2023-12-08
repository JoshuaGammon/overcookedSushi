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
              <th>Mark As Bought</th>
              <th>Remove From List</th>
            </thead>
            <tbody>
              {data.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowData.ingredient_id}</td>
                  <td>{rowData.ingredient_name}</td>
                  <td>{rowData.quantity_numerator/rowData.quantity_denominator}</td>
                  <td>{rowData.measurement_type}</td>
                  <td>
                    <button onClick = {() => markBought(rowData.ingredient_id)}>Mark as Bought</button>
                  </td>
                  <td>
                    <button onClick = {() => deleteFromList(rowData.ingredient_id)}>Remove From List</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
        <button onClick = {() => migrateGroceries()}>Mark All Items as Bought</button>
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

function markBought(id){
  fetch('http://localhost:8081/markBought/' + id)
  .then(res => res.json())
  .catch(err => console.log(err));

  //Force page refresh
};

function deleteFromList(id){
  fetch('http://localhost:8081/deleteFromList/' + id)
  .then(res => res.json())
  .catch(err => console.log(err));

  //Force page refresh
};

function migrateGroceries() {
  fetch('http://localhost:8081/migrateGroceries')
  .then(res => res.json())
  .catch(err => console.log(err));

  //Force page refresh
};

export default Grocery;