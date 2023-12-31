//  This file is base app file that start when npm start is called

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css'; // CSS Import statement

function App() {
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
          <li className="navbar-item">
            <Link to="/newRecipe" className="navbar-link">Add a recipe</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
