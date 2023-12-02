//  Imports
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

//  Connecting to DB
const db = mysql.createConnection({
    host: '',
    user: '',
    password: '', // FILL IN
    database: '' // FILL IN
})

//  API Calls
app.get('/retrieveUsers', (req,res)=>{
    const sql = "SELECT * FROM User"
    db.query(sql, (err,data) => {
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

app.get('/retrieveGrocery', (req,res)=>{
    const sql = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id"
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/migrateGroceries', (req,res)=>{
    const grabGroceries = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id"
    db.query(grabGroceries, (err1, data1) => {
        if(err1) return res.json(err1);
        else {
            for(let i = 0; i < data1.length; i++){
                const insertIntoPantry = "INSERT INTO Pantry VALUES ('juliac', " + data1[i].ingredient_id + ", CURDATE(), " + data1[i].quantity_numerator + ", " + data1[i].quantity_denominator + ", '" + data1[i].measurement_type + "')";
                db.query(insertIntoPantry, (err2, data2) => {
                    if(err2) return res.json(err2);
                    else {
                        if(data2.affectedRows == 1){
                            const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = " + data1[i].ingredient_id;
                            db.query(removeFromGrocery, (err3, data3) => {
                                if(err3) return res.json(err3);
                                else {
                                    if(data3.affectedRows == 1) return res.json(true);
                                    else return res.json(false);
                                }
                            })
                        }
                        else{
                            return res.json(false);
                        }
                    }
                })
            }
        }
    })
})

app.get('/', (req,res) => {
    return res.json("From backend side")
})

app.listen(8081, () => {
    console.log("listening");
})