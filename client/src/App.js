//  This file is base app file that start when npm start is called

import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
//  import './App.css'; // CSS Import statement

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
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/groceries">Grocery List</Link>
          </li>
          <li>
            <Link to="/pantry">Pantry</Link>
          </li>
          <li>
            <Link to="/recipes">Recipes</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
