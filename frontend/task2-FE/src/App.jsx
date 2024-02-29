import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [newData, setNewData] = useState('');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    handleGet();
  }, []); 

  const handleAdd = () => {
    axios.post('http://localhost:3000/api/data', { action: 'add', newData })
      .then(response => {
        handleGet();
      })
      .catch(error => {
        console.error('Error adding data:', error);
      });
      setNewData('');
  };

  const handleUpdate = (id, updatedValue) => {
    axios.patch(`http://localhost:3000/api/data/${id}`, { action: 'update', newData: updatedValue })
      .then(response => {
        handleGet();
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleGet = () => {
    axios.get('http://localhost:3000/api/data')
      .then(response => {
        setTables(response.data);
      })
      .catch(error => {
        console.error('Error getting data:', error);
      });
  };

  const handleInputChange = (id, value) => {
    setTables(prevTables => {
      return prevTables.map(item => {
        if (item._id === id) {
          return { ...item, newData: value };
        }
        return item;
      });
    });
  };

  const getCount = (id) => {
    axios.get(`http://localhost:3000/api/count/${id}`)
    .then(res=> res.data)
     .catch(error => {
        console.error('Error getting data:', error);
      });
  }

  return (
    <div style={{display: "flex",alignItems: "center",justifyContent: "space-between"}}>
      <div style={{margin: "30px"}}>
        <input type="text" value={newData} onChange={(e) => setNewData(e.target.value)} />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        {tables.map((item) => (
          <div key={item._id}>
            <input
              type="text"
              value={item.newData}
              onChange={(e) => handleInputChange(item._id, e.target.value)}
            />
            <button onClick={() => handleUpdate(item._id, item.newData)}>Update</button>
            <span style={{marginLeft: "10px"}}>{item.count ? item.count : 0}</span>
            </div>
            ))}
            <button onClick={handleGet}>GET</button>
            </div>
            </div>
            );
          }
          
          export default App;
          // <button onClick={()=>getCount(item._id)}>Get Count</button>
