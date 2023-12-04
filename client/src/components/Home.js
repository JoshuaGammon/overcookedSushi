import React, { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/pantryItems')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

  console.log(data)
  let expiringItems = [];

  data.map((item) => {
    let daysLeft = item.daysLeft //(Date.now() - item.bought_date) - item.shelf_life; //just doing in query now
    let itemName = item.ingredient_name;
    if (item.daysLeft <= 7) {
      expiringItems.push({ itemName, daysLeft });
    }
  });
  console.log(expiringItems)

  return (
    <div className="home-container">
      <section className="main-content">
        <h1>Overcooked Sushi</h1>
        <p>Discover and share recipes, all while reducing your food waste!</p>
      </section>

      <section className="expiring-items">
        <h3>Welcome back! You have a few items that might expire soon:</h3>
        <ul>
          {expiringItems.map((item, index) => (
            <li key={index}>
              {item.itemName} - {item.daysLeft} days left 
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;