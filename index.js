const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();;
app.use(cors());
const port = process.env.PORT || 9000;
const uri = process.env.DB_URL;


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
        const docAppointDB = client.db("docAppiontDB");
        const docAppointCollection = docAppointDB.collection("docAppointCollection")

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("hellow");
});

app.listen(port, () => {
    console.log(`server with running http://localhost:${port}`);
});