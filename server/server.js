// ====================================
// Importando librerías externas
// ====================================
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

// Archivo de configuración
require('./config/config')

// Inicializa app como instancia de express
const app = express()

// ====================================
// Middlewarea
// ====================================

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Hablitar la carpeta public para servir archivos estáticos
app.use(express.static(path.resolve(__dirname, '../public')))

// Importa rutas
app.use(require('./routes'))

// Conecta a base de datos MongoDB
mongoose.connect(process.env.urlDB, err =>{
  if (err) throw err
  console.log("Base de datos ONLINE");
})

// Levanta la aplicación y queda a la escucha
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`))