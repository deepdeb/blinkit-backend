const express = require('express')
const userRoute = require('./routes/userRoute')
const commonRoute = require('./routes/commonRoute')
require('dotenv').config()
const port = process.env.PORT
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true
}))

app.use(cookieParser())

app.use(express.json())
app.use('/user', userRoute)
app.use('/common', commonRoute)

app.get('/test', (req, res) => {
    res.send('blinkit test api called')
})

app.listen(port, () => {
    console.log(`server listening on port: ${port}`)
})