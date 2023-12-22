const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5001


// middleware
app.use(cors())
app.use(express.json())


app.listen(port, () => {
    console.log('server running on', port);
})

app.get('/', (req, res) => {
    res.send('server is running')
})