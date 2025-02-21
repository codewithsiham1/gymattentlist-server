const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT||5000;
app.use(cors())
app.use(express.json())
// gym-attendnence
// Dtg6SjBjQa5nrGLc

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.leope.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const gymschedule=client.db('gymscheduleDB').collection('gymschedule')
    const usercollection=client.db('userscheduleDB').collection('userschedule')
    app.post('/schedules',async(req,res)=>{
        const data=req.body;
        console.log(data)
        const result=await gymschedule.insertOne(data)
        res.send(result)
    })
    app.get('/schedules', async (req, res) => {
      const {searchParams}=req.query;
      let option={};
      if(searchParams){
        option={title:{$regex:searchParams,$options:'i'}} ;
      }
        const result = await gymschedule.find(option).toArray();
        res.send(result);
    });
    app.delete('/schedules/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await gymschedule.deleteOne(query)
      res.send(result)
    })
    app.get('/schedules/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await gymschedule.findOne(query)
      res.send(result)
    })
    app.put('/schedules/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const options={upsert:true};
      const updategym=req.body;
      const gym={
        $set:{
          title:updategym.title,date:updategym.date,day:updategym.day,time:updategym.time
        }
      }
      const result=await  gymschedule.updateOne(filter,gym,options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Gym Server Is Running ON Port')
})
app.listen(port,(req,res)=>{
    console.log(`Gym Server Is Running ON port:${port}`)
})