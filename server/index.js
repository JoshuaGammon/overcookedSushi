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
    password: '', // FILL IN
    database: '' // FILL IN
})

//  API Calls
app.get('/retrieveUsers', (req,res)=>{
    const sql = "SELECT * FROM User"
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/retrieveGrocery', (req,res)=>{
    const sql = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id"
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