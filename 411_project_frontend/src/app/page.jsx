"use client";
import React, { useState, useEffect } from 'react';
import "./page.css";

// MUI Stuff
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const axios = require('axios'); // Axios stuff

export default function Home() {
  // React State variables
  const [movieName, setMovieName] = useState("");
  const [res, setResult] = useState("");
  const [login, setLogin] = useState(false);

  useEffect(() => {
  }, [res]);

  // Reques Data
  const fetchData = (x) => {
    const params = {
      name: x,
    };

    axios.get('http://localhost:4000/data', { params })
    .then(function (response) {
        console.log('Data fetched successfully:', response.data);
        if (response.data === "Data Not Found!") {
          setResult("Data Not Found!");
          return;
        }

        let string_res = `
        ============= Results ============= \n
        Movie Name: ${response.data[0].name} \n
        Rating: ${response.data[0].rating} \n
        Production Company: ${response.data[0].production} \n
        Budget: ${response.data[0].budget} \n
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
            <Chip style={{marginRight: "20px"}} label="Not Logged In" color="primary" />  
            <Button variant="contained">Log-In</Button>
          </div>
        </div>
          <TextField id="outlined-basic" label="Movie Title" onChange={onTextChange} variant="outlined" style={{width: "100%", margin: 10}} />
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
