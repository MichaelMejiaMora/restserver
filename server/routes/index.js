// ====================================
// Importando librerías externas
// ====================================
const express = require('express')

// Inicializa app como instancia de express
const app = express()

// Referencia a las otras rutas
app.use(require('./user'))
app.use(require('./login'))

// Exporta app
module.exports = app