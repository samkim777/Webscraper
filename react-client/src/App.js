import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";


function App() {
  const [data, setData] = useState([]);
  let list = [];

  



  const getData = () => {
    axios.post('/').then((res) => setData(res.data))
    // So this fetches the data properly, if the url is valid
    // Debug, fetching data from index.js port, not from react port
  }

  useEffect(() => {
    getData();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        <div> Meow Meow </div>
        <h1>{Object.keys(data).map(key => key + ": " + data[key])}</h1>
      </header>
    </div>
  );
}

export default App;
