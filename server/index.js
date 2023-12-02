//  Imports
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

//  Connecting to DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#overcookedSushi345#', // FILL IN
    database: 'test_db' // FILL IN
})

//  API Calls
app.get('/users', (req,res)=>{
    const sql = "SELECT * FROM test_table"
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/pantryItems', (req,res)=>{
    const sql = "SELECT i.ingredient_id, i.ingredient_name, p.bought_date, p.quantity_numerator, p.quantity_denominator, p.measurement_type, i.shelf_life, i.shelf_life - DATEDIFF(CURDATE(), p.bought_date) AS daysLeft FROM Ingredient AS i JOIN Pantry AS p ON i.ingredient_id = p.ingredient_id";
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/', (req,res)=>{
    return res.json("From backend side")
})

app.listen(8081, ()=>{
    console.log("listening");
})