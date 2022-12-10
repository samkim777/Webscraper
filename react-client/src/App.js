import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";


function App() {
  const [data, setData] = useState([]);

  const [product, setProduct] = useState([{}]);



  const getData = () => {
    axios.get('/')
    .then((res) => setProduct(res.data))
    // fetches the data properly, if the url is valid
 
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="products">
    {product.map((user) => (
      <div className="products">{user}</div>
      ///!!!
    ))}
  </div>

  );
}

export default App;
