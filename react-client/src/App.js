import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";


function App() {
  const [data, setData] = useState('');

  const [product, setProduct] = useState([]);



  const getData = () => {
    axios.get('http://localhost:3001/',{crossdomain:true}) // Fetching from localhost:3000
    .then((res) => setProduct(res.data))
    // fetches the data properly, if the url is valid
 
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="products">
    <div> Meow Meow</div>
     {product.map(data => data.Name + data.Rating + data.Price)}
  </div>

  );
}

export default App;
