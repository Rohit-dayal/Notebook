const connectToMongo = require("./db");
const express = require('express')
connectToMongo();
const app = express()
const port = 5000
// to call the api from the browser we used cors 
var cors = require('cors')
app.use(cors())

// i have to write npm start in terminal to run the app

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening at port http://localhost:${port}`)
})

