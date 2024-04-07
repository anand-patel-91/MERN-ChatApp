const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const messageRoutes = require('./routes/messages')

const app = express()
app.use(express.json())

app.use('/api/messages' , messageRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log('connected to db and listening on port', process.env.PORT)
    })
}).catch((error)=>{
    console.log(error)
}) 
