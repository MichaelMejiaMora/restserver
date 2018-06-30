const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const app = express()

app.post('/login', (req, res) => {
  let body = req.body
  User.findOne({email:body.email}, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if(!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    if(!bcrypt.compareSync(body.password,userDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    // Generamos token
    let token = jwt.sign({
      usuario: userDB
    }, process.env.SEED,
    {
      expiresIn : process.env.CADUCIDAD_TOKEN
    })

    // Devolvemos el objeto y el token
    res.json({
      ok: true,
      user: userDB,
      token
    })
  })
})

module.exports = app