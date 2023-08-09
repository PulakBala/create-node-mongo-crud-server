const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//midelware
app.use(cors());
app.use(express.json());

//user : pulak1
//pass: iMJ0kNPToQgh6qMn


const uri = "mongodb+srv://pulak1:iMJ0kNPToQgh6qMn@cluster0.f304rnn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const Usercollection = client.db('nodeMongoCrud').collection('users')

    app.get('/users', async(req, res) =>{
      const query = {};
      const cursor = Usercollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/users', async (req, res) =>{
      const user = req.body
      console.log(user);
      const result = await Usercollection.insertOne(user);
      res.send(result);
    })

    app.delete('/users/:id', async (req, res) =>{
      const id = req.params.id;
      // console.log('trying to delete',id);
      const query = {_id: new ObjectId(id)}
      const result = await Usercollection.deleteOne(query);
      console.log(result)
      res.send(result)
    })

    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await Usercollection.findOne(query);
      console.log(user)
      res.send(user);
    })

    app.put('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const  filter = await Usercollection.findOne(query)
      const user = req.body;
      const option = {upsert : true};
      const updateUser = {
        $set: {
          name: user.name,
          addres: user.addres,
          email: user.email
        }
      }
      const result = await Usercollection.updateOne(filter, updateUser, option)
      console.log(result);
    })
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Hello from node mongo crud server')
})

app.listen(port, () =>{
    console.log(`Listening to port ${port}`)
})