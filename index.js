const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");


const app = express();;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 9000;
const uri = process.env.DB_URL;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`))

const userCheckMidleware = async(req, res, next) => {
    const authHeader = req.headers.authoraization;
    const token = authHeader.split(' ')[1];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthoraizated" });
    };
    if (!token) {
        return res.status(401).json({ message: "Unauthoraizated" });
    };
    try {
        const { payload } = await jwtVerify(token, JWKS);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbiden" });
    };



}

async function run() {
    try {

        await client.connect();
        const docAppointDB = client.db("docAppiontDB");
        const docAppointCollection = docAppointDB.collection("docAppointCollection")
        const userAppointCollection = docAppointDB.collection("userAppointCollection")




        // top 3 rating doctor appoint 
        app.get("/api/doctors/top", async(req, res) => {
                const TopdoctoraAppoint = await docAppointCollection.find().sort({ rating: -1 }).limit(3).toArray();
                res.json(TopdoctoraAppoint);

            })
            // get all Doctor appoint
        app.get("/api/doctors/all", async(req, res) => {
            const alldoctoraAppoint = await docAppointCollection.find().toArray();
            res.json(alldoctoraAppoint);
        })

        // search doctor by name
        app.get("/api/doctors/search", async(req, res) => {
            const searchName = req.query.name || "";
            const searchResult = await docAppointCollection.find({
                name: { $regex: searchName, $options: "i" }
            }).toArray();
            res.json(searchResult);
        })

        // get Single Doctor appoint
        app.get("/api/doctors/:id", userCheckMidleware, async(req, res) => {
            const singDocAppointId = new ObjectId(req.params.id)
            const singleDocAppointResult = await docAppointCollection.findOne({ _id: singDocAppointId })

            res.json(singleDocAppointResult);
        })

        // booking appointentment
        app.post("/api/user/appointment/create", async(req, res) => {

                const AppInsInfo = req.body;
                const inserResult = await userAppointCollection.insertOne({ AppInsInfo });
                res.json(inserResult);


            })
            // geit all booking appoinments
        app.get("/api/user/appointment/all", async(req, res) => {
            const bookingAppiont = await userAppointCollection.find().toArray();
            res.json(bookingAppiont)
            console.log(bookingAppiont)
        })

        // get booking appointments by user email
        app.get("/api/user/appointment", async(req, res) => {
            const userEmail = req.query.email;
            const userBookings = await userAppointCollection.find({ "AppInsInfo.useremail": userEmail }).toArray();
            res.json(userBookings);
        })

        // update booking appointment
        app.put("/api/user/appointment/:id", userCheckMidleware, async(req, res) => {
            const appointId = new ObjectId(req.params.id);
            const updatedInfo = req.body;
            const updateResult = await userAppointCollection.updateOne({ _id: appointId }, { $set: { AppInsInfo: updatedInfo } });
            res.json(updateResult);
        })

        // delete booking appointment
        app.delete("/api/user/appointment/:id", userCheckMidleware, async(req, res) => {
            const appointId = new ObjectId(req.params.id);
            const deleteResult = await userAppointCollection.deleteOne({ _id: appointId });
            res.json(deleteResult);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.json({ status: "ok", message: "DocAppoint server is running" });
});

app.listen(port, () => {
    console.log(`server with running http://localhost:${port}`);
});