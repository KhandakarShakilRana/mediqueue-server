const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const app = express();
const port = 5000

app.use(cors());
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const db = client.db("mediqueue");
    const collection = db.collection("tutors");

    app.get('/tutors', async (req, res) => {
        const cursor = collection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/tutors/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collection.findOne(query);
        res.send(result);
    })

    app.patch('/tutors/:id', async (req, res) => {
        const id = req.params.id;
        const updatedTutor = req.body;
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {$set: updatedTutor}
        )
        res.send(result);
    })
    app.delete('/tutors/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collection.deleteOne(query);
        res.send(result);
    })



    app.post('/tutors', async (req, res) => {
        const tutor = req.body;
        console.log(tutor);
        const result = await collection.insertOne(tutor);
        res.send(result);
    })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

