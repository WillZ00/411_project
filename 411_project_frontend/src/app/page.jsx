"use client";
import React, { useState, useEffect } from 'react';
import "./page.css";

// MUI Stuff
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

// Google OAuth
import { gapi } from 'gapi-script';

const clientId = '1012866216283-t8kasva4ua0pshbs1amkjou3farbrck9.apps.googleusercontent.com';

const axios = require('axios'); // Axios stuff

export default function Home() {
  // React State variables
  const [movieName, setMovieName] = useState("");
  const [res, setResult] = useState("");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    function initializeGoogleSignIn() {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: clientId,
                scope: 'email profile'
            });
        });
    }

    initializeGoogleSignIn();
  }, [res, login]);

  // Request Data
  const fetchData = (x) => {
    const params = {
      name: x,
    };

    axios.get('http://localhost:4000/data', { params })
    .then(function (response) {
        console.log('Data fetched successfully:', response.data);

        // Now to Parse the data
        let db = response.data.db;
        let api_1 = response.data.api_1;
        let api_2 = response.data.api_2;

        let name = "N/A";
        let rating = "N/A";
        let production = "N/A";
        let budget = "N/A";
        let plot = "N/A";
        let quote = "N/A";

        if (db.data !== "Data Not Found!") {
          name = db[0].name;
          rating = db[0].rating;
          production = db[0].production;
          budget = db[0].budget;
        }
        if (api_1 !== "Error!") {
          plot = api_1.Plot;
        }
        if (api_2 !== "Error!") {
          quote = api_2;
        }

        let string_res = `
        ============= Results ============= \n
        Movie Name: ${name} \n
        Rating: ${rating} \n
        Production Company: ${production} \n
        Budget: ${budget} \n\n
        Plot: ${plot} \n\n
        Quote of the Day: ${quote}\n

        `
        setResult(string_res);
    })
    .catch(function (error) { // Error
        console.log('Error fetching data:', error);
    })
  }

  // Functions to handle interaction
  const onClick = () => {
    console.log(movieName);
    fetchData(movieName);

  }

  const loginBtn = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({
      prompt: 'select_account'
    }).then(googleUser => {
        const profile = googleUser.getBasicProfile();
        setLogin(true)
    }).catch(err => {
        console.log('Failed to login', err);
    });
  }

  const onTextChange = (k) => {
    setMovieName(k.target.value);
  }

  return (
    <>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div style={{justifyContent:"center", alignItems:"center", width: "100%", display: "flex", flexDirection: "column"}}>
          <h1 style={{width: "fit-content"}}>Movie Database 2.0!</h1>
          <h2>CS 411 Project Group 17 (Ed, Lilia, and Will)</h2>
          <div style={{flexDirection: "row", display: "flex", margin: "10px", alignItems: "center"}}>
            {login ? <Chip style={{marginRight: "20px"}} label="Logged In" color="success" /> : <Chip style={{marginRight: "20px"}} label="Not Logged In" color="primary" /> }
             
            <Button variant="contained" onClick={loginBtn}>Log-In</Button>
          </div>
        </div>
          <TextField disabled={!login} id="outlined-basic" label="Movie Title" onChange={onTextChange} variant="outlined" style={{width: "100%", margin: 10}} />
          <Button onClick={onClick} variant="contained" style={{width: "10%"}}>Search!</Button>

          <TextField
          style={{width: "100%", margin: 10}}
          id="outlined-multiline-flexible" 
          placeholder='Search Result'
          value={res}
          multiline
          maxRows={100}
          />
      </div>
    </>
  );
}
