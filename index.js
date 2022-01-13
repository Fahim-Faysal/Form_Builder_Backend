const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.yeroo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
      try {
            await client.connect();


            const database = client.db("FormBuilder");
            const formcollection = database.collection("formData");
            const finalCOllection = database.collection('finalform');


            app.post('/fdata', async (req, res) => {
                  const data = req.body;
                  const result = await formcollection.insertOne(data);
                  res.json(result)
            })

            app.get('/fdata', async (req, res) => {
                  const cursor = formcollection.find({});
                  const result = await cursor.toArray()
                  res.send(result)
            })

            app.get('/form/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) }
                  const result = await formcollection.findOne(query)
                  res.json(result)
            })

            app.post('/finalform', async (req, res) => {
                  const data = req.body;
                  const result = await finalCOllection.insertOne(data)
                  res.json(result)
            })

            app.get('/finalform', async (req, res) => {
                  const cursor = finalCOllection.find({})
                  const result = await cursor.toArray()
                  res.send(result)
            })
            app.get('/finalform/:id', async (req, res) => {
                  const id = req.params.id;
                  console.log(id);
                  const query = { _id: ObjectId(id) }
                  const result = await finalCOllection.findOne(query)
                  res.json(result)
            })


      }
      finally {
            // await client.close();
      }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
      res.send('Hello World!')
})

app.listen(port, () => {
      console.log(`Port running at http://localhost:${port}`)
})