const express = require('express')
const app = express()
const port = 3000

const fs = require('fs');
const path = require('path');

__dirname="player/"

function deleteAllJsonInFolder(folderPath, callback) {
    // Read the contents of the folder
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        callback(new Error(`Error reading folder: ${err.message}`));
        return;
      }
  
      // Filter out non-JSON files
      const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
  
      if (jsonFiles.length === 0) {
        callback(null, 'No JSON files to delete.');
        return;
      }
  
      // Delete each JSON file
      let deleteCount = 0;
      jsonFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
  
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            callback(new Error(`Error deleting file ${file}: ${unlinkErr.message}`));
            return;
          }
  
          deleteCount++;
          if (deleteCount === jsonFiles.length) {
            callback(null, `${deleteCount} JSON file(s) deleted successfully.`);
          }
        });
      });
    });
  }
  

function appendPlayerColor(playerId, color, callback) {
    const filePath = path.join(__dirname, `${playerId}.json`);
  
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // Create the file with initial player data
      const initialData = {
        id: playerId,
        colors: [color],
        date:Date.now()
      };
  
      fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          callback(new Error(`Error creating file for player ID ${playerId}: ${writeErr.message}`));
          return;
        }
        callback(null, `File created and color ${color} added for player ID ${playerId} successfully.`);
      });
      return;
    }
  
    // Read the file if it exists
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(new Error(`Error reading file for player ID ${playerId}: ${err.message}`));
        return;
      }
  
      let playerData;
  
      // Parse the JSON data
      try {
        playerData = JSON.parse(data);
      } catch (parseErr) {
        callback(new Error(`Error parsing JSON for player ID ${playerId}: ${parseErr.message}`));
        return;
      }
  
      // Append the color to the colors array
      if (!Array.isArray(playerData.colors)) {
        playerData.colors = [];
      }
      playerData.colors.push(color);
      playerData.date=Date.now()
  
      // Write the updated JSON back to the file
      fs.writeFile(filePath, JSON.stringify(playerData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          callback(new Error(`Error writing file for player ID ${playerId}: ${writeErr.message}`));
          return;
        }
        callback(null, `Color ${color} appended to player ID ${playerId} successfully.`);
      });
    });
  }



function getRandomColors() {
    const colors = ["blue", "green", "orange", "yellow"];
    
    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    
    return colors;
}


function loadAllJsonInFolder(folderPath, callback) {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        callback(new Error(`Error reading folder: ${err.message}`));
        return;
      }
  
      const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
  
      if (jsonFiles.length === 0) {
        callback(null, []);
        return;
      }
  
      const jsonDataArray = [];
      let readCount = 0;
  
      jsonFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
  
        fs.readFile(filePath, 'utf8', (readErr, data) => {
          if (readErr) {
            callback(new Error(`Error reading file ${file}: ${readErr.message}`));
            return;
          }
  
          try {
            const jsonData = JSON.parse(data);
            jsonDataArray.push(jsonData);
          } catch (parseErr) {
            callback(new Error(`Error parsing JSON from file ${file}: ${parseErr.message}`));
            return;
          }
  
          readCount++;
          if (readCount === jsonFiles.length) {
            callback(null, jsonDataArray);
          }
        });
      });
    });
  }
  const cors = require('cors');

currentGame=getRandomColors()
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/current', (req, res) => {
    res.json(currentGame)
  })


  app.get('/newgame', (req, res) => {
    currentGame=getRandomColors()
    const folderPath = path.join(__dirname);
deleteAllJsonInFolder(folderPath, (err, message) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(message);
  }
});
    res.json(currentGame)
  })
 
  // Express route to handle the GET request
app.get('/updatePlayerColor', (req, res) => {
    const playerId = req.query.playerId;
    const color = req.query.color;
  
    if (!playerId || !color) {
      res.status(400).send('playerId and color query parameters are required');
      return;
    }
  
    appendPlayerColor(playerId, color, (err, message) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send(message);
      }
    });
})

app.get('/updatePlayerColor', (req, res) => {
    const playerId = req.query.playerId;
    const color = req.query.color;
  
    if (!playerId || !color) {
      res.status(400).send('playerId and color query parameters are required');
      return;
    }
  
    appendPlayerColor(playerId, color, (err, message) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send(message);
      }
    });
})

app.get('/loadAllPlayerFiles', (req, res) => {
    const folderPath = path.join(__dirname);
  
    loadAllJsonInFolder(folderPath, (err, jsonDataArray) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(jsonDataArray);
      }
    });
  });

app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})