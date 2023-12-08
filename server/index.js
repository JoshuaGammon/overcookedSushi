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

app.get('/allIngredients', (req,res)=>{
    const sql = "SELECT ingredient_name, ingredient_id FROM Ingredient"
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/createRecipe', (req,res)=>{
    const { recipeName, servings, steps, classification, attribution, ingredients } = req.body;

    const createRecipe = "INSERT INTO Recipe (recipe_name, servings, steps, classification, attribution) VALUES (?, ?, ?, ?, ?)";

    const values = [recipeName, servings, steps, classification, attribution];

    db.query(createRecipe, values, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })

    getRecipeID(recipeName, (err, recipeID) => {
        if (err) {
            console.error(err);
        } else {
            addContainment(ingredients, recipeID);
        }
    });
})

function addContainment(ingredients, recipeID, res) {
    ingredients.forEach(ingredient => {
        const addContItem = "INSERT INTO Containment (recipe_id, ingredient_id, quantity_numerator, quantity_denominator, measurement_type) VALUES (?, ?, ?, ?, ?)";
        
        const values1 = [recipeID, ingredient.ingredient_id, ingredient.quantity, 1, ingredient.unit]
        db.query(addContItem, values1, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to add containment' });
            } else {
            }
        })
    });
}

function getRecipeID(recipeName, callback) {
    const sql = "SELECT DISTINCT recipe_id FROM Recipe WHERE recipe_name = ?";
    db.query(sql, [recipeName], (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            const recipeID = data.length > 0 ? data[0].recipe_id : null; //just in case not distinct
            callback(null, recipeID);
        }
    });
}

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

app.get('/recipes/:recipe_id', async (req,res)=>{
    let id = req.params.recipe_id;
    let ingredientLst = [];
    const ingredients = "SELECT Ingredient.ingredient_id, Ingredient.ingredient_name, Containment.quantity_numerator, Containment.quantity_denominator, Containment.measurement_type FROM Containment INNER JOIN Ingredient ON Containment.ingredient_id = Ingredient.ingredient_id WHERE Containment.recipe_id = ?";
    
    try {
        const data1 = await new Promise((resolve, reject) => {
            db.query(ingredients, [id], (err1,data) =>{
                if(err1) reject(err1);
                else resolve(data);
            })
        })

        for(let i = 0; i < data1.length -1; i++){
            const pantryCheck = "SELECT * FROM Pantry WHERE ingredient_id = " + data1[i].ingredient_id;

            try{
                const data2 = await new Promise((resolve, reject) => {
                    db.query(pantryCheck, (err2, data) => {
                        if(err2) reject(err2);
                        else resolve(data);
                    })
                })

                if (data2.length > 0){
                    if (data1[i].measurement_type == data2[0].measurement_type){
                        let pantry = data2[0].quantity_numerator / parseFloat(data2[0].quantity_denominator);
                        let recipe = data1[i].quantity_numerator / parseFloat(data1[i].quantity_denominator);
                        if(pantry >= recipe){
                            ingredientLst.push(
                                {
                                    "ingredient_id": data1[i].ingredient_id,
                                    "ingredient_name": data1[i].ingredient_name,
                                    "quantity_numerator": data1[i].quantity_numerator,
                                    "quantity_denominator": data1[i].quantity_denominator,
                                    "measurement_type": data1[i].measurement_type,
                                    "pantry": true,
                                }
                            )
                        }
                    } else {
                        try{
                            [recipe_num, recipe_den] = convertUnits(data1[i].measurement_type, data2[0].measurement_type, data1[i].quantity_numerator, data1[i].quantity_denominator);

                        } catch (e) {
                            console.log("Problem converting units.")
                            return res.json("Can't convert units");
                        }

                        let pantry = data2[0].quantity_numerator / parseFloat(data2[0].quantity_denominator);
                        let recipe = recipe_num / parseFloat(recipe_den);
                        if(pantry >= recipe){
                            ingredientLst.push(
                                {
                                    "ingredient_id": data1[i].ingredient_id,
                                    "ingredient_name": data1[i].ingredient_name,
                                    "quantity_numerator": data1[i].quantity_numerator,
                                    "quantity_denominator": data1[i].quantity_denominator,
                                    "measurement_type": data1[i].measurement_type,
                                    "pantry": true,
                                }
                            )
                        }
                    }
                } else {
                    ingredientLst.push(
                        {
                            "ingredient_id": data1[i].ingredient_id,
                            "ingredient_name": data1[i].ingredient_name,
                            "quantity_numerator": data1[i].quantity_numerator,
                            "quantity_denominator": data1[i].quantity_denominator,
                            "measurement_type": data1[i].measurement_type,
                            "pantry": false,
                        }
                    )
                }
            } catch (err) {
                return res.json(err);
            }
        }
        //console.log(ingredientLst);
        return res.json(ingredientLst);

    } catch (err){
        return res.json(err);
    }
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
        return res.json(data);
    })
})

//Returns numerator and denominator according to the destination's units
function convertUnits(sourceUnits, destinationUnits, numerator, denominator){
    let num = numerator;
    let den = denominator;

    if(sourceUnits == destinationUnits) return [num, denominator];

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

app.post('/addIngredients', (req, res) => {
    let ingredients = req.body;
            for(let i = 0; i < ingredients.length; i++){
                if(!ingredients[i].pantry){
                    const existenceCheck = "SELECT * FROM Grocery_List WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = " + ingredients[i].ingredient_id;
                    db.query(existenceCheck, (err2, data) => {
                        if(err2) return res.json(err2);
                        else{
                            let num = ingredients[i].quantity_numerator;
                            let den = ingredients[i].quantity_denominator;
                            //If that ingredient exists in the grocery list
                            if(data.length > 0) {
                                console.log("in if");
                                let destUnits = data[0].measurement_type;
                                let sourceUnits = ingredients[i].measurement_type;
                                try{
                                    [num, den] = convertUnits(sourceUnits, destUnits, ingredients[i].quantity_numerator, ingredients[i].quantity_denominator);
                                }
                                catch (e) {
                                    console.log("Problem converting units.")
                                    return res.json(false);
                                }

                                const updatedQuantity = addFractions(data[0].quantity_numerator, num, data[0].quantity_denominator, den);
                                const updateGrocery = "UPDATE Grocery_List SET quantity_numerator = " + updatedQuantity[0] + ", quantity_denominator = " + updatedQuantity[1] + " WHERE ingredient_id = " + data[0].ingredient_id;
                                db.query(updateGrocery, (err3, data2) => {
                                    if(err3) return res.json(err3);
                                    else {
                                        if(data2.affectedRows != 1) return res.json(false);
                                    }
                                })
                            }
                            //If that ingredient does not exist in the grocery list
                            else {
                                const insertIntoGrocery = "INSERT INTO Grocery_List VALUES ('juliac', " + ingredients[i].ingredient_id + "," + ingredients[i].quantity_numerator + ", " + ingredients[i].quantity_denominator + ", '" + ingredients[i].measurement_type + "')";
                                db.query(insertIntoGrocery, (err4, data3) => { 
                                    if(err4) return res.json(err4);
                                    else {
                                        if(data3.affectedRows != 1) return res.json(false);
                                    }
                                })
                            }
                        }
                    })
                }
            }
    return res.json(true);
})

app.get('/markBought/:ingredient_id', (req, res) => {
    let id = req.params.ingredient_id;
    const grabIngredient = "SELECT * FROM Grocery_List WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = ?";
    db.query(grabIngredient, [id], (err1, data1) => {
        if(err1) return res.json(err1);
        else {
            if(data1.length > 1) return res.json(false);
            else {
                const existenceCheck = "SELECT * FROM Pantry WHERE Pantry.username = 'juliac' AND Pantry.ingredient_id = ?";
                db.query(existenceCheck, [id], (err2, data2) => {
                    if(err2) return res.json(err2);
                    else{
                        let num = data1[0].quantity_numerator;
                        let den = data1[0].quantity_denominator;
                        //If that ingredient exists in the pantry
                        if(data2.length > 0) {
                            let destUnits = data2[0].measurement_type;
                            let sourceUnits = data1[0].measurement_type;
                            try{
                                [num, den] = convertUnits(sourceUnits, destUnits, data1[0].quantity_numerator, data1[0].quantity_denominator);
                            }
                            catch (e) {
                                console.log("Problem converting units.")
                                return res.json(false);
                            }

                            let dateMatch = false;
                            let indexMatch = -1;
                            let currentDate = new Date().toDateString() + " 00:00:00 GMT-0600 (Central Standard Time)";
                            for(let i = 0; i < data2.length; i++){
                                if(data2[i].bought_date == currentDate){
                                    dateMatch = true;
                                    indexMatch = i;
                                }
                            }

                            //If the date is the same (alter)
                            if(dateMatch){
                                const updatedQuantity = addFractions(data2[indexMatch].quantity_numerator, num, data2[indexMatch].quantity_denominator, den)
                                const updatePantry = "UPDATE Pantry SET quantity_numerator = " + updatedQuantity[0] + ", quantity_denominator = " + updatedQuantity[1] + " WHERE ingredient_id = ? AND bought_date = CURDATE()";
                                db.query(updatePantry, [id], (err3, data3) => {
                                    if(err3) return res.json(err3);
                                    else {
                                        if(data3.affectedRows == 1){
                                            const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = ?";
                                            db.query(removeFromGrocery, [id], (err4, data4) => {
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
                                const insertIntoPantry = "INSERT INTO Pantry VALUES ('juliac', " + id + ", CURDATE(), " + num + ", " + den + ", '" + destUnits + "')";
                                db.query(insertIntoPantry, (err5, data5) => {
                                    if(err5) return res.json(err5);
                                    else {
                                        if(data5.affectedRows == 1){
                                            const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = ?";
                                            db.query(removeFromGrocery, [id], (err6, data6) => {
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
                            const insertIntoPantry = "INSERT INTO Pantry VALUES ('juliac', ?, CURDATE(), " + data1[0].quantity_numerator + ", " + data1[0].quantity_denominator + ", '" + data1[0].measurement_type + "')";
                            db.query(insertIntoPantry, [id], (err7, data7) => {
                                if(err7) return res.json(err7);
                                else {
                                    if(data7.affectedRows == 1){
                                        const removeFromGrocery = "DELETE FROM Grocery_List WHERE Grocery_List.ingredient_id = ?";
                                        db.query(removeFromGrocery, [id], (err8, data8) => {
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

app.get('/deleteFromList/:ingredient_id', (req, res) => {
    let id = req.params.ingredient_id;
    const deleteIngredient = "DELETE FROM Grocery_List WHERE ingredient_id = ?";
    db.query(deleteIngredient, [id], (err, data) => {
        if(data.affectedRows == 1) return res.json(true);
        else return res.json(false);
    })
})

app.get('/addToFavorites/:recipe_id', (req, res) => {
    let id = req.params.recipe_id;
    const addFavorite = "INSERT INTO Personal_Recipes VALUES ('juliac', ?)";
    db.query(addFavorite, [id], (err, data) => {
        if(data.affectedRows == 1) return res.json(true);
        else return res.json(false);
    })
})

app.get('/removeFromFavorites/:recipe_id', (req, res) => {
    let id = req.params.recipe_id;
    const removeFavorite = "DELETE FROM Personal_Recipes WHERE username = 'juliac' AND recipe_id = ?";
    db.query(removeFavorite, [id], (err, data) => {
        if(data.affectedRows == 1) return res.json(true);
        else return res.json(false);
    })
})

app.get('/checkIfFavorite/:recipe_id', (req, res) => {
    let id = req.params.recipe_id;
    const checkFavorite = "SELECT * FROM Personal_Recipes WHERE username = 'juliac' AND recipe_id = ?";
    db.query(checkFavorite, [id], (err, data) => {
        if(data.length > 0) return res.json(true);
        else return res.json(false);
    })
})

app.get('/favorites', (req, res) => {
    const favorites = "SELECT * FROM Personal_Recipes, Recipe WHERE Personal_Recipes.recipe_id = Recipe.recipe_id";
    db.query(favorites, (err, data) => {
        if(err) return res.json(err);
        else return res.json(data);
    })
})

app.get('/deleteFromPantry/:ingredient_id', (req, res) => {
    let id = req.params.ingredient_id;
    const deleteIngredient = "DELETE FROM Pantry WHERE ingredient_id = ?";
    db.query(deleteIngredient, [id], (err, data) => {
        if(data.affectedRows == 1) return res.json(true);
        else return res.json(false);
    })
})

app.get('/removeIngredients/:recipe_id', (req, res) => {
    let id = req.params.recipe_id;
    const recipeIngredients = "SELECT Ingredient.ingredient_name, Ingredient.ingredient_id, Containment.quantity_numerator, Containment.quantity_denominator, Containment.measurement_type FROM Containment INNER JOIN Ingredient ON Containment.ingredient_id = Ingredient.ingredient_id WHERE Containment.recipe_id = ?";
    db.query(recipeIngredients, [id], (err1, data1) => {
        if(err1) return res.json(err1);
        else {
            if(data1.length > 0){
                //For each of the ingredients
                for(let i = 0; i < data1.length; i++){
                    const pantryOccurences = "SELECT ingredient_id, quantity_numerator, quantity_denominator, measurement_type, bought_date FROM Pantry WHERE ingredient_id = ? ORDER BY bought_date ASC";
                    db.query(pantryOccurences, [data1[i].ingredient_id], (err2, data2) => {
                        if(err2) return res.json(err2);
                        else {
                            //Ingredient is in the pantry
                            if(data2.length > 0){
                                //console.log("ingredient is in the pantry");
                                let recipeNumerator = data1[i].quantity_numerator;
                                let recipeDenominator = data1[i].quantity_denominator;
                                let recipeUnits = data1[i].measurement_type;
                                
                                let j = 0; 
                                let fulfilled = false;
                                while((j < data2.length) && (!fulfilled)){
                                    let pantryNumerator = data2[j].quantity_numerator;
                                    let pantryDenominator = data2[j].quantity_denominator;
                                    let pantryUnits = data2[j].measurement_type;
                                    let convertedNumerator = 0;
                                    let convertedDenominator = 0;

                                    try{
                                        [convertedNumerator, convertedDenominator] = convertUnits(recipeUnits, pantryUnits, recipeNumerator, recipeDenominator);
                                    }
                                    catch (e) {
                                        console.log("Problem converting units.");
                                        return res.json(false);
                                    }

                                    if((convertedNumerator/convertedDenominator) < (pantryNumerator/pantryDenominator)){
                                        let subtractedPantryQuantity = addFractions(pantryNumerator, -1*convertedNumerator, pantryDenominator, convertedDenominator);
                                        const updateEntry = "UPDATE Pantry SET quantity_numerator = " + subtractedPantryQuantity[0] + ", quantity_denominator = " + subtractedPantryQuantity[1] + " WHERE ingredient_id = " + data1[i].ingredient_id + " AND bought_date = '" + data2[j].bought_date.toISOString().slice(0,10) + "'";
                                        db.query(updateEntry, (err3, data3) => {
                                            if(err3) return res.json(err3);
                                        })
                                        fulfilled = true;
                                    }
                                    else{
                                        const deleteEntry = "DELETE FROM Pantry WHERE ingredient_id = " + data1[i].ingredient_id + " AND bought_date = '" + data2[j].bought_date.toISOString().slice(0,10) + "'";
                                        db.query(deleteEntry, (err4, data4) => {
                                            if(err4) return res.json(err4); 
                                        })
                                        let subtractedRecipeQuantity = addFractions(convertedNumerator, -1*pantryNumerator, convertedDenominator, pantryDenominator);
                                        if(subtractedRecipeQuantity[0] == 0) fulfilled = true;
                                        else {
                                            //console.log("did not exit. subtracted recipe quantity is " + subtractedRecipeQuantity[0]/subtractedRecipeQuantity[1] + " for " + data1[i].ingredient_id);
                                            recipeNumerator = subtractedRecipeQuantity[0];
                                            recipeDenominator = subtractedRecipeQuantity[1];
                                            recipeUnits = pantryUnits;
                                        }
                                    }
                                    ++j;
                                }
                            }
                        }
                    })
                }
                return res.json(true);
            }
            else return res.json(false);
        }
    })
})

app.get('/migrateGroceries', (req, res) => {
    const grabGroceries = "SELECT * FROM Grocery_List, Ingredient WHERE Grocery_List.username = 'juliac' AND Grocery_List.ingredient_id = Ingredient.ingredient_id";
    db.query(grabGroceries, (err1, data1) => {
        if(err1) return res.json(err1);
        else {
            for(let i = 0; i < data1.length; i++){
                const existenceCheck = "SELECT * FROM Pantry WHERE Pantry.username = 'juliac' AND Pantry.ingredient_id = " + data1[i].ingredient_id;
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
                                console.log("Problem converting units.");
                                return res.json(false);
                            }

                            let dateMatch = false;
                            let indexMatch = -1;
                            let currentDate = new Date().toDateString() + " 00:00:00 GMT-0600 (Central Standard Time)";
                            for(let j = 0; j < data2.length; j++){
                                if(data2[j].bought_date == currentDate){
                                    dateMatch = true;
                                    indexMatch = j;
                                }
                            }

                            //If the date is the same (alter)
                            if(dateMatch){
                                const updatedQuantity = addFractions(data2[indexMatch].quantity_numerator, num, data2[indexMatch].quantity_denominator, den)
                                const updatePantry = "UPDATE Pantry SET quantity_numerator = " + updatedQuantity[0] + ", quantity_denominator = " + updatedQuantity[1] + " WHERE ingredient_id = " + data2[0].ingredient_id + " AND bought_date = CURDATE()";
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