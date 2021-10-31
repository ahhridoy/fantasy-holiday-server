const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1xse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("fantasyHoliday");
    const servicesCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })

    // POST API
    app.post("/services", async (req, res) => {
      const newServices = req.body;
      const result = await servicesCollection.insertOne(newServices);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Crud Server");
});

app.listen(port, () => {
  console.log("Running server on port", port);
});
