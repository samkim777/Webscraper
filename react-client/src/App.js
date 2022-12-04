import React from "react";
import {useState,useEffect} from 'react';
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = useState('');

  

  useEffect(() => {
    fetch("/api")
      .then((data) => setData(data.message));
  }, []);

  

  return (
    <div className="App">
      <header className="App-header">
        <div className = 'Item-box'> <p>Name</p> <p>Rating</p><p>Price</p> </div>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
