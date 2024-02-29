const express = require('express');
const { MongoClient ,ObjectId} = require('mongodb');

const app = express();

let db;

//middleware for execution time
app.use((req, res, next) => {
  const start = new Date();

  res.on('finish', () => {
    const end = new Date();
    const executionTime = end - start;
    console.log(`[${req.method}] ${req.path} - Execution Time: ${executionTime}ms`);
  });

  next();
});


//  CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());


// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017')
  .then(client => {
    db = client.db('dataneuron'); 
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

// API to get data
app.get('/api/data', async (req, res) => {
  const data = await db.collection('dataneuron').find().toArray();
  res.json(data);
});

// API to post data
app.post('/api/data', async (req, res) => {
  const newData = req.body;

  await db.collection('dataneuron').insertOne({...newData,count: 1});

  res.json({ success: true });
});

// API to patch data
app.patch('/api/data/:id', async (req, res) => {
  const id = req.params.id; 
 const existingData = await db.collection('dataneuron').findOne({ _id: new ObjectId(id) });

  if (!existingData) {
    return res.status(404).json({ error: 'Not Found' });
  }

  const updatedData = {
    ...existingData,
    ...req.body,
    count: existingData.count ? existingData.count+1 : 1,
  };  

  const result = await db.collection('dataneuron').updateOne(
    { _id: new ObjectId(id) }, 
    { $set: updatedData }
  );
  if (result.matchedCount > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// API to get count
app.get('/api/count/:id', async (req, res) => {
    const id = req.params.id; 
    const existingData = await db.collection('dataneuron').findOne({ _id: new ObjectId(id) });
    res.json({count: existingData.count});
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
