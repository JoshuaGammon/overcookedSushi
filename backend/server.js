//super unsure on what the middle man is between this and SQL

const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'your-mysql-host',
    user: 'your-mysql-username',
    password: 'your-mysql-password',
    database: 'your-database-name',
});

connection.connect((err) => {
    if (err) {
      console.error('Could not find DB', err);
      return;
    }
    console.log('Connected to DB');
});