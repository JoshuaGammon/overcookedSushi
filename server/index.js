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
    password: 'Must$coch24', // FILL IN
    database: 'overcookedSushi_db' // FILL IN
})

//  API Calls
app.get('/recipes', (req,res)=>{
    const sql = "SELECT * FROM Recipe"
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

/*app.post('/recipes', (req,res)=>{
    const sql = "INSERT INTO Recipe () VALUES (?)"
})*/

app.get('/recipes/:recipe_id', (req,res)=>{
    //console.log(req.body.id)
    let id = req.params.recipe_id;
    const ingredients = "SELECT Ingredient.ingredient_id, Ingredient.ingredient_name, Containment.quantity_numerator, Containment.quantity_denominator, Containment.measurement_type FROM Containment INNER JOIN Ingredient ON Containment.ingredient_id = Ingredient.ingredient_id WHERE Containment.recipe_id = ?"
    db.query(ingredients, [id], (err,data) =>{
        if(err) return res.json(err);
        //console.log(data)
        return res.json(data);
    })
})

app.get('/pantry/:ingredient_id', (req,res) => {
    let id = req.params.ingredient_id;
    const q = "SELECT * FROM Pantry WHERE ingredient_id = ?"
    db.query(q, [id], (err,data) =>{
        if(err) return res.json(err);
        //console.log(data)
        return res.json(data);
    })
})

app.get('/', (req,res)=>{
    return res.json("From backend side")
})

app.listen(8081, ()=>{
    console.log("listening");
})