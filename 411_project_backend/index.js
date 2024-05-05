const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 4000;
const axios = require('axios');

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: "", 
  database: '411_project' 
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
    let query_movie_name = req.query.name;
    let sql_query = 
    `
    SELECT M.name,M.rating,M.production,M.budget 
    FROM MotionPicture M 
    WHERE M.name LIKE '${query_movie_name}'
    `

    let payload = {
      db: "",
      api_1: "",
      api_2: ""
    }

    db.query(sql_query, (error, results, fields) => {
        if (error) {
            res.status(500).send('Failed to retrieve data');
        throw error;
        }
        if (results.length == 0) {
            payload.db = "Data Not Found!";
        } else {
            //console.log(results); // Output the result to the console [Debugging purposes]
            payload.db = results;
            // API #1
            axios.get(`http://www.omdbapi.com/?apikey=de4af98a&t=${query_movie_name.replace(' ', '+')}&plot=full`)
            .then(function (response) {
                payload.api_1 = response.data;
            })
            .catch(function (error) { // Error
                console.log('Error fetching data:', error);
                payload.api_1 = "Error!";
            }).then(() => {
              // API #2
              axios.get(`https://favqs.com/api/qotd`)
              .then(function (response) {
                  payload.api_2 = response.data.quote.body;

                  // Send off payload after chain
                  res.json(payload);
              })
              .catch(function (error) { // Error
                  console.log('Error fetching data:', error);
                  payload.api_1 = "Error!";
              })
            })   
        }
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

