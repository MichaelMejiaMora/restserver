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
  process.env.urlDB = MONGO_URI
}

// =========================
//      Seed de JWT
// =========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// =========================
//   Vencimiento del token
// =========================
process.env.CADUCIDAD_TOKEN = "30 days"
