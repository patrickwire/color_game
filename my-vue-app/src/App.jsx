import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {
  const [data, setData] = useState([]);
  const [timepassed, setTimePassed] = useState(0);
  const [dataPlayer, setDataPlayer] = useState([]);
  const [timeover, setTimeover] = useState(false);
  const [showResults, setShowResults] = useState(false);


  useEffect(() => {
    fetchData();
    setTimeout(()=>setTimePassed(1),500)
    setTimeout(()=>setTimePassed(2),1000)
    setTimeout(()=>setTimePassed(3),1500)
    setTimeout(()=>setTimeover(true),2000)
    setTimeout(()=>fetchPlayerData(),7000)
   
  }, []);


  const compareArrays = (array1, array2) => {
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  };
  
  const ComparisonTable = ({ json1, json2 ,playernumber}) => {
    console.log(json1)
    const isMatching = compareArrays(json1[playernumber].colors, json2);
  
    const cellStyle = {
      backgroundColor: isMatching ? 'green' : 'red',
      padding: '5px',
      border: '1px solid #ccc'
    };
    const date = new Date(json1[playernumber].date);
const pos=isMatching?json1.filter(d=>d.date<json1[playernumber].date&&compareArrays(d.colors, json2)).length+1:0
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();
const milliseconds = date.getMilliseconds();

    return (
     
          <tr>
            <td>{json1[playernumber].id}</td><td>{pos!==0?"# "+pos:""}</td>
            {json1[playernumber].colors.filter((d,idx)=>idx<4).map(d=><td style={cellStyle}>{d}</td>)}
          </tr>
    
    );
  };
  


const fetchPlayerData = async () => {
    try {
      const response = await fetch('http://161.35.75.101:3000/loadAllPlayerFiles');
      const jsonData = await response.json();
    
      setDataPlayer(jsonData.sort((a,b)=>{
        a.date-b.date
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://161.35.75.101:3000/current');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

if(dataPlayer.length>0){
  return <div>
    <h1>the correct order is</h1>
    <div>
    {data.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: item,
            padding: '20px',
            margin: '10px',
            color: 'black',
            borderRadius: '5px',
            display: 'inline-block',
          }}
        >
          <h2>{item}</h2>
        </div>
      ))}
    </div>
    <table style={{ borderCollapse: 'collapse', width: '100%' ,fontSize:50}}>
  <thead>
    <tr>
      <th>ID</th>
      <th>Pos</th>
      <th>Colors</th>
    </tr>
  </thead>
  <tbody>{dataPlayer.sort((a,b)=>a.date-b.date).map((d,idx)=>{
    return  <ComparisonTable json1={dataPlayer} json2={data} playernumber={idx} />
  })}</tbody></table><button style={{margin:30}} onClick={()=>{fetch("http://161.35.75.101:3000/newGame");
    setTimeout(()=>{window.location.reload();
    },500)

  }}>new Game</button>
  <div><img style={{width:400}} src='https://api.qrcode-monkey.com/tmp/b8609d343ee60ef0e1e2d8b9db902b12.svg?1717854921248'></img></div>
  </div>
}

  if(!showResults&&timeover){
    return <div style={{width:"100vw",height:"100vh",backgroundColor:"black",color:"white",flex:1,justifyContent:"center",alignItems:"center"}}>
      <img src='https://s3.ezgif.com/tmp/ezgif-3-b7a36ed8fd.webp'></img></div>
  }


  const colors=["#2596be", "green", "orange", "yellow"]
  return (
    <div>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: colors[index],
            opacity:index===timepassed?1:0,
            padding: '20px',
            margin: '10px',
            color:  "black",
            borderRadius: '5px',
            display: 'inline-block',
            fontSize:50
          }}
        >
          <h2>{item}</h2>
        </div>
      ))}
    </div>
  );
}

export default App
