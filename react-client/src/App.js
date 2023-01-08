import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";



function App() {


  const [product, setProduct] = useState([]);
  
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };






  const getData = () => {
    axios.get('http://localhost:3001/',{params: {
      data: value // GET request with user value
    }},{crossdomain:true}) // Fetching from localhost:3000
    .then((res) => setProduct(res.data))

  }

  useEffect(() => {
    getData()
   
  }, []);

  return (
    <div className="products">
         <input type="text" />
         <button onClick={() => getData(value)}>Search</button>
     {product.map(data => <div> {data.Name} + {data.Rating} + {data.Price} </div>)}
  </div>

  );
}

export default App;
