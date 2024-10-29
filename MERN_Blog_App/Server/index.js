import express from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
config()


import userRoute from './routes/user.route.js'

const app = express()

// connect to mongoDB
connect(process.env.MONGO)
.then(()=> {
    console.log("connected to DB")
})
.catch((err)=> {
    console.log(err)
})


app.listen(3000, ()=> {
    console.log("listening to port 3000")
})

app.use('/api/user', userRoute)