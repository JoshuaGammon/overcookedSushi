import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
//  import './index.css';
import Layout from './App';
import Grocery from './components/Grocery'
import Pantry from './components/Pantry'
import Recipe from './components/Recipe'
import RecipeEntry from './components/recipeEntry'
import Home from './components/Home';

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="groceries" element={<Grocery />} />
          <Route path="pantry" element={<Pantry />} />
          <Route path="recipes" element={<Recipe />} />
          <Route path="recipes/:recipe_name" element={<RecipeEntry />} loader={({params}) => {console.log(params.recipe_name);}} action={({params}) => {}} ele/>
          <Route path="addIngredients/:recipe_id" element={<RecipeEntry />} loader={({params}) => {console.log(params.recipe_id);}} action={({params}) => {}} ele/>
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
