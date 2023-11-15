//  This file is base app file that start when npm start is called

import React, { useEffect, useState } from 'react';
//  import './App.css'; // CSS Import statement
//  import Home from './components/Home' // Import for Home Page

function App() {
  const [data, setData] = useState([])
  useEffect(()=>{
//  Accesses DB info through backend server
    fetch('http://localhost:8081/users')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])
//  Returning html of simple table that displays the data
  return (
    <div>
        <table>
          <thead>
            <th>ID</th>
            <th>Name</th>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
              <td>{d.user_id}</td>
              <td>{d.user_name}</td>
            </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;
