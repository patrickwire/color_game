// ColoredBoxList.js
import React, { useState, useEffect } from 'react';

const ColoredBoxList = () => {
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

  colors=["blue","orange","greenn","yellow"]
  return (
    <div>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color[index],
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
};

export default ColoredBoxList;
