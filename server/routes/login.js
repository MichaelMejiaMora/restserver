// ====================================
// Importando librerías externas
// ====================================
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// Importa el userSchema
const User = require('../models/user')

// Inicializa app como instancia de express
const app = express()

// ====================================
// Trabajando el login de usuario
// ====================================
app.post('/login', (req, res) => {
  let body = req.body
  
  // Busca en la BD según email
  User.findOne({email:body.email}, (err, userDB) => {
    // En caso de error
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    // Si no se encuentra el email
    if(!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      })
    }
    // Si se encuentra el email, verificar contraseña
    if(!bcrypt.compareSync(body.password,userDB.password)) {
      // Si no coinciden
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    // Si coinciden,
    // Generamos token
    let token = jwt.sign({
      usuario: userDB // Payload
    }, process.env.SEED, // Semilla
    {
      expiresIn : process.env.CADUCIDAD_TOKEN // Caducidad
    })

    // Devolvemos el objeto y el token
    res.json({
      ok: true,
      user: userDB,
      token
    })
  })
})

// ====================================
// Trabajando con Google Sign-In
// ====================================

// Función asíncrona que verifica el token
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  // Retorna un objeto personalizado en base a datos de Google
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

// Ruta de autentificación con Google
app.post('/google', async (req, res) => {
  let token = req.body.idtoken // Recibe token
  let googleuser = await verify(token) // Llama la función para verificar token
  .catch(e => {
    return res.status(403).json({
      ok: false,
      err: e
    })
  })
  
  User.findOne({email:googleuser.email}, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(userDB) { // Si existe el usuario
      if (userDB.google === false) { // pero no es usuario de Google
        return res.status(500).json({
          ok: false,
          err: {
            message: 'Debe usar autenticación normal'
          }
        })
      } else { // Generamos token
        let token = jwt.sign({
          usuario: userDB // Payload
        }, process.env.SEED, // Semilla
        {
          expiresIn : process.env.CADUCIDAD_TOKEN // Caducidad
        })

        return res.json({
          ok:true,
          usuario: userDB,
          token
        })
      }
    } else {
      // Si el usuario no existe en la BD
      let user = new User()
      user.nombre = googleuser.nombre
      user.email = googleuser.email
      user.img = googleuser.img
      user.google = true
      user.password = ':)'

      user.save((err, userDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        let token = jwt.sign({
          usuario: userDB // Payload
        }, process.env.SEED, // Semilla
        {
          expiresIn : process.env.CADUCIDAD_TOKEN // Caducidad
        })

        return res.json({
          ok:true,
          usuario: userDB,
          token
        })
      })

    }
  })
})

// Exporta app
module.exports = app