require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'))

mongoose.connect(process.env.urlDB, err =>{
  if (err) throw err

  console.log("Base de datos ONLINE");
})

app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`))