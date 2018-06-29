// =========================
//      Puerto
// =========================
process.env.PORT = process.env.PORT || 3000

// =========================
//      Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =========================
//      Base de datos
// =========================

if (process.env.NODE_ENV === 'dev') {
  process.env.urlDB = 'mongodb://localhost:27017/cafe'
} else {
  process.env.urlDB = 'mongodb://cafe-user:a123456@ds123181.mlab.com:23181/cafe-node'
}