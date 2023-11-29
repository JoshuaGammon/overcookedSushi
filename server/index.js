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
    const sql = "SELECT * FROM pantry_table"
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