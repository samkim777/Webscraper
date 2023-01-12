import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";




function App() {
  
  let results = [];

  const [product, setProduct] = useState([]);
  
  const [status, setStatus] = useState('');

  // const onChange = (event) => {
  //   setValue(event.target.value);
  // };

function DataLoaded() {
  return <div> {Object.entries(product).map(data => data.Name)}</div>
  
}

function DataLoading()  {
  return <h1> Loading... </h1>
}

function fetchData() {
  if (product.length == 0) {
    return <DataLoading/>
  } else return <DataLoaded/>
}




function getData() {
   axios.get('http://localhost:3001/',{params: {
      data: 'keyboard' // GET request with user value
    }},{crossdomain:true}) 
    .then(res => {console.log(res.data);
                 setProduct(res)}) 
}




  useEffect(() => {
    // getData()

   
  }, []);

  return (
    <div className="products">
         <input type="text" />
         <button onClick={() => getData()}>Search</button>
         {fetchData()}
  </div>

  );
}

export default App;
