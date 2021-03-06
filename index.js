const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

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
        const placeOrdersCollection = database.collection("placeOrder");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });

        // ADD services
        app.post("/addServices", async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            res.json(result.insertedId);
        });

        // get one product
        app.get("/placeOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await servicesCollection.findOne(query);
            res.send(order);
        });

        // post one product for place order
        app.post("/placeOrder", async (req, res) => {
            const placeOrder = req.body;
            const result = await placeOrdersCollection.insertOne(placeOrder);
            res.json(result);
        });

        // get product by using email
        app.get("/myOrders", async (req, res) => {
            const cursor = placeOrdersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // DELETE order
        app.delete("/myOrders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await placeOrdersCollection.deleteOne(query);
            console.log(result);
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
