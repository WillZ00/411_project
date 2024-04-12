const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 4000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost', // Replace with your host, usually localhost
  user: 'root', // Replace with your database username
  password: "", // Replace with your database password
  database: '411_project' // Replace with your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + db.threadId);
});

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route for GET requests to the home page
app.get('/', (req, res) => {
    res.json("Index Page");
});

// Get movie stuff
app.get('/data', (req, res) => {
    let movie_names = [];
    let query_movie_name = req.query.name;
    let sql_query = 
    `
    SELECT M.name,M.rating,M.production,M.budget 
    FROM MotionPicture M 
    WHERE M.name LIKE '${query_movie_name}'
    `

    db.query(sql_query, (error, results, fields) => {
        if (error) {
            res.status(500).send('Failed to retrieve data');
        throw error;
        }
        if (results.length == 0) {
            res.json("Data Not Found!");
        } else {
            console.log(results); // Output the result to the console

            // API #1

            // API #2

            
            res.json(results);
        }
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

