const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

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

    // single food details api
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ghostFoodCollection.findOne(query);
      res.send(result);
    });

    // update for get api
    app.get("/updateFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ghostFoodCollection.findOne(query);
      res.send(result);
    });

    //  update put api
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const ghostFood = req.body;
      // console.log(ghostFood);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGhostFood = {
        $set: {
          availableQuantity: ghostFood.availableQuantity,
          description: ghostFood.description,
          img: ghostFood.img,
          price: ghostFood.price,
        },
      };
      const result = await ghostFoodCollection.updateOne(
        filter,
        updatedGhostFood,
        options
      );
      // console.log(result);
      res.send(result);
    });

    // delete api for ghost food item delete
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(' delete from database', id);
      const query = { _id: new ObjectId(id) };
      const result = await ghostFoodCollection.deleteOne(query);
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

// setup
app.get("/", (req, res) => {
  res.send("ghost food server is running now");
});

app.listen(port, () => {
  console.log(`ghost food server is running on port: ${port}`);
});
