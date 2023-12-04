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
app.get('/recipes', (req,res)=>{
    const sql = "SELECT * FROM Recipe"
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
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

app.get('/retrieveGrocery', (req,res)=>{
    const sql = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id"
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
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

//Returns numerator and denominator according to the destination's units
function convertUnits(sourceUnits, destinationUnits, numerator, denominator){
    let num = numerator;
    let den = denominator;

    if(sourceUnits == destinationUnits) return [num, denominator];
    else if(sourceUnits == 'Unit(s)' && destinationUnits != 'Unit(s)') throw new Error("Cannot convert from Unit(s) into " + destinationUnits);
    else if(sourceUnits != 'Unit(s)' && destinationUnits == 'Unit(s)') throw new Error("Cannot convert into Unit(s) from " + sourceUnits);

    //Converts everything into ounces
    if(sourceUnits == 'Cup(s)') num = num * 8;
    else if(sourceUnits == 'Tablespoon(s)') den = den * 2;
    else if(sourceUnits == 'Teaspoon(s)') den = den * 6;
    else if(sourceUnits == 'Pound(s)') num = num * 16;
    else if(sourceUnits == 'Ounce(s)') num = num * 1;
    else throw new Error("Did not recognize source unit type " + sourceUnits);

    //Converts from ounces to everything else
    if(destinationUnits == 'Cup(s)') den = den * 8;
    else if(destinationUnits == 'Tablespoon(s)') num = num * 2;
    else if(destinationUnits == 'Teaspoon(s)') num = num * 6;
    else if(destinationUnits == 'Pound(s)') den = den * 16;
    else if(destinationUnits == 'Ounce(s)') num = num * 1;
    else throw new Error("Did not recognize destination unit type " + destinationUnits);

    return [num, den];
}

function addFractions(numerator1, numerator2, denominator1, denominator2){
    if(denominator1 == denominator2) return [numerator1 + numerator2, denominator1];
    else return [(numerator1 * denominator2) + (numerator2 * denominator1), denominator1 * denominator2];
}

app.get('/addIngredients/:recipe_id', (req, res) => {
    let id = req.params.recipe_id;
    const ingredients = "SELECT Ingredient.ingredient_id, Ingredient.ingredient_name, Containment.quantity_numerator, Containment.quantity_denominator, Containment.measurement_type FROM Containment INNER JOIN Ingredient ON Containment.ingredient_id = Ingredient.ingredient_id WHERE Containment.recipe_id = ?";
    db.query(ingredients, [id], (err1, data1) =>{
        if(err1) return res.json(err1);
        else {
            for(let i = 0; i < data1.length; i++){
                const existenceCheck = "SELECT * FROM Grocery_List WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = " + data1[i].ingredient_id;
                db.query(existenceCheck, (err2, data2) => {
                    if(err2) return res.json(err2);
                    else{
                        let num = data1[i].quantity_numerator;
                        let den = data1[i].quantity_denominator;
                        //If that ingredient exists in the grocery list
                        if(data2.length > 0) {
                            console.log("in if");
                            let destUnits = data2[0].measurement_type;
                            let sourceUnits = data1[i].measurement_type;
                            try{
                                [num, den] = convertUnits(sourceUnits, destUnits, data1[i].quantity_numerator, data1[i].quantity_denominator);
                            }
                            catch (e) {
                                console.log("Problem converting units.")
                                return res.json(false);
                            }

                            const updatedQuantity = addFractions(data2[0].quantity_numerator, num, data2[0].quantity_denominator, den);
                            const updateGrocery = "UPDATE Grocery_List SET quantity_numerator = " + updatedQuantity[0] + ", quantity_denominator = " + updatedQuantity[1] + " WHERE ingredient_id = " + data2[0].ingredient_id;
                            db.query(updateGrocery, (err3, data3) => {
                                if(err3) return res.json(err3);
                                else {
                                    if(data3.affectedRows != 1) return res.json(false);
                                }
                            })
                        }
                        //If that ingredient does not exist in the grocery list
                        else {
                            const insertIntoGrocery = "INSERT INTO Grocery_List VALUES ('juliac', " + data1[i].ingredient_id + "," + data1[i].quantity_numerator + ", " + data1[i].quantity_denominator + ", '" + data1[i].measurement_type + "')";
                            db.query(insertIntoGrocery, (err4, data4) => { 
                                if(err4) return res.json(err4);
                                else {
                                    if(data4.affectedRows != 1) return res.json(false);
                                }
                            })
                        }
                    }
                })
            }
        }
        return res.json(true);
    })
})

app.get('/removeIngredients/:recipe_id', (req, res) => {
    let id = req.params.ingredient_id;
})

app.get('/migrateGroceries', (req, res) => {
    const grabGroceries = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id"
    db.query(grabGroceries, (err1, data1) => {
        if(err1) return res.json(err1);
        else {
            for(let i = 0; i < data1.length; i++){
                const existenceCheck = "SELECT * FROM Pantry WHERE Pantry.username = 'juliac' AND Pantry.ingredient_id = " + data1[i].ingredient_id
                db.query(existenceCheck, (err2, data2) => {
                    if(err2) return res.json(err2);
                    else{
                        let num = data1[i].quantity_numerator;
                        let den = data1[i].quantity_denominator;
                        //If that ingredient exists in the pantry
                        if(data2.length > 0) {
                            let destUnits = data2[0].measurement_type;
                            let sourceUnits = data1[i].measurement_type;
                            try{
                                [num, den] = convertUnits(sourceUnits, destUnits, data1[i].quantity_numerator, data1[i].quantity_denominator);
                            }
                            catch (e) {
                                console.log("Problem converting units.")
                                return res.json(false);
                            }

                            //If the date is the same (alter)
                            let currentDate = new Date();
                            if(data2[0].bought_date.toISOString().slice(0,10) == currentDate.toISOString().slice(0,10)){
                                const updatedQuantity = addFractions(data2[0].quantity_numerator, num, data2[0].quantity_denominator, den)
                                const updatePantry = "UPDATE Pantry SET quantity_numerator = " + updatedQuantity[0] + ", quantity_denominator = " + updatedQuantity[1] + " WHERE ingredient_id = " + data2[0].ingredient_id;
                                db.query(updatePantry, (err3, data3) => {
                                    if(err3) return res.json(err3);
                                    else {
                                        if(data3.affectedRows == 1){
                                            const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = " + data1[i].ingredient_id;
                                            db.query(removeFromGrocery, (err4, data4) => {
                                                if(err4) return res.json(err4);
                                                else {
                                                    if(data4.affectedRows != 1) return res.json(false);
                                                }
                                            })
                                        }
                                        else return res.json(false);
                                    }
                                })
                            }
                            //If the date is different (insert)
                            else{
                                const insertIntoPantry = "INSERT INTO Pantry VALUES ('juliac', " + data1[i].ingredient_id + ", CURDATE(), " + num + ", " + den + ", '" + destUnits + "')";
                                db.query(insertIntoPantry, (err5, data5) => {
                                    if(err5) return res.json(err5);
                                    else {
                                        if(data5.affectedRows == 1){
                                            const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = " + data1[i].ingredient_id;
                                            db.query(removeFromGrocery, (err6, data6) => {
                                                if(err6) return res.json(err6);
                                                else {
                                                    if(data6.affectedRows != 1) return res.json(false);
                                                }
                                            })
                                        }
                                        else return res.json(false);
                                    }
                                })
                            }
                        }
                        //If that ingredient does not exist in the pantry
                        else {
                            const insertIntoPantry = "INSERT INTO Pantry VALUES ('juliac', " + data1[i].ingredient_id + ", CURDATE(), " + data1[i].quantity_numerator + ", " + data1[i].quantity_denominator + ", '" + data1[i].measurement_type + "')";
                            db.query(insertIntoPantry, (err7, data7) => {
                                if(err7) return res.json(err7);
                                else {
                                    if(data7.affectedRows == 1){
                                        const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = " + data1[i].ingredient_id;
                                        db.query(removeFromGrocery, (err8, data8) => {
                                            if(err8) return res.json(err8);
                                            else {
                                                if(data8.affectedRows != 1) return res.json(false);
                                            }
                                        })
                                    }
                                    else return res.json(false);
                                }
                            })
                        }
                    }
                })
            }
        }
        return res.json(true);
    })
})

app.get('/', (req,res) => {
    return res.json("From backend side")
})

app.listen(8081, () => {
    console.log("listening");
})