import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  let list = [];



  const getData = () => {
    axios.get('/').then((res) => console.log(res.data))
    // Debug, fetching data from index.js port, not from react port
  }

  useEffect(() => {
    getData();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        <div> {list} </div>
      </header>
    </div>
  );
}

export default App;
