const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.08jlhdc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const ghostFoodCollection = client
      .db("ghostFood")
      .collection("allGhostFood");

    // all ghost food data get api
    app.get("/allFood", async (req, res) => {
      const cursor = ghostFoodCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    // new food post for post api
    app.post("/allFood", async (req, res) => {
      const allFood = req.body;
      const result = await ghostFoodCollection.insertOne(allFood);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ghost food server is running");
});

app.listen(port, () => {
  console.log(`ghost food server is running on port: ${port}`);
});
