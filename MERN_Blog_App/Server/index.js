import express from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
config()



import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'

const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json())

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
app.use('/api/auth', authRoute)