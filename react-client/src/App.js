import React from "react";
import {useState,useEffect} from 'react';
import axios from "axios";
import "./App.css";



function App() {
  const [data, setData] = useState('');

  const [product, setProduct] = useState([]);
  
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  function fetchData(item) {
    console.log(item)
  }




  const getData = () => {
    axios.get('http://localhost:3001/',{crossdomain:true}) // Fetching from localhost:3000
    .then((res) => setProduct(res.data))
    // fetches the data properly, if the url is valid
 
  }

  useEffect(() => {
    fetchData()
   
  }, []);

  return (
    <div className="products">
         
         <button onClick={() => fetchData(value)}>Search</button>
     {product.map(data => <div> {data.Name} + {data.Rating} + {data.Price} </div>)}
  </div>

  );
}

export default App;
