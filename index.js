const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

const port = process.env.PORT || 1001;

app.listen(port, () => {
    console.log('server running on', port);
})

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gytm2d.mongodb.net/?retryWrites=true&w=majority`;

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
        const taskCollection = client.db('taskManagementDB').collection('task')

        app.get('/api/v1/get-task', async (req, res) => {
            const email = req.query.email
            const query = {
                email: email
            }
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/api/v1/create-task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        })

        app.patch('/api/v1/update-task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const query = {
                _id: new ObjectId(id)
            }
            const update = {
                $set: {
                    status: task.taskToMap
                }
            };
            const result = await taskCollection.updateOne(query, update)
            res.send(result)
        })

        app.delete('/api/v1/delete-task/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {
                _id: new ObjectId(id)
            }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})