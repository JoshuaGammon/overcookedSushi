//  This file is base app file that start when npm start is called

import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css'; // CSS Import statement

function App() {
  const [data, setData] = useState([])
  useEffect(()=>{
//  Accesses DB info through backend server

  }, [])
//  Returning html of simple table that displays the data
  return (
    <>
      <nav>
        <ul className="navbar">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/groceries" className="navbar-link">Grocery List</Link>
          </li>
          <li className="navbar-item">
            <Link to="/pantry" className="navbar-link">Pantry</Link>
          </li>
          <li className="navbar-item">
            <Link to="/recipes" className="navbar-link">Recipes</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
