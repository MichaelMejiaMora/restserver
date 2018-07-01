// =========================
//      Puerto
// =========================
process.env.PORT = process.env.PORT || 3000

// =========================
//      Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =========================
// URL de Base de datos
// =========================
if (process.env.NODE_ENV === 'dev') {
  process.env.urlDB = 'mongodb://localhost:27017/cafe'
} else {
  // Variable definida en Heroku
  process.env.urlDB = process.env.MONGO_URI
}

// =========================
//      Seed de JWT
// =========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// =========================
//   Vencimiento del token
// =========================
process.env.CADUCIDAD_TOKEN = "30 days"

// =========================
//   Google Client Id
// =========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '892933758773-b5re5e84opanl8s002l1lnes2k8mpun2.apps.googleusercontent.com'
