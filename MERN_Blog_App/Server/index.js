const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

// connect to mongoDB
mongoose.connect(process.env.MONGO)
.then(()=> {
    console.log("connected to DB")
})
.catch((err)=> {
    console.log(err)
})


app.listen(3000, ()=> {
    console.log("listening to port 3000")
})