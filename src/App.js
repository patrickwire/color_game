import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect } from 'react';



function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/currentGame');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const colors=["blue","orange","greenn","yellow"]
  return (
    <div>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: colors[index],
            padding: '20px',
            margin: '10px',
            color: 'white',
            borderRadius: '5px',
            display: 'inline-block',
          }}
        >
          <h2>{item}</h2>
        </div>
      ))}
    </div>
  );
}

export default App;
