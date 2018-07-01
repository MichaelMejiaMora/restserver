// ====================================
// Importando librerías externas
// ====================================
const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

// Importa el userSchema
const User = require('../models/user')

// Importa middlewares
const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion')

// Inicializa app como instancia de express
const app = express()

// ====================================
// Procesando las peticiones GET (read)
// ====================================
app.get('/usuario', verificaToken, (req, res) => {
  let limit = req.query.limit || 5
  limit = Number(limit)

  let from = req.query.from || 0
  from = Number(from)
  User.find({estado:true})
    .skip(from)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        usuarios:users
      })
    })
})
// ====================================
// Procesando las peticiones POST (create)
// ====================================
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
  let body = req.body
  let user = new User({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  user.save((err,userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })
})
// ====================================
// Procesando las peticiones PUT (update)
// ====================================
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id
  let body = _.pick(req.body,['nombre', 'email', 'img', 'role', 'estado'])

  User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      usuario: userDB
    })
  })
})
// ====================================
// Procesando las peticiones DELETE
// ====================================
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id

  User.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!deletedUser) {
      res.json({
        ok: false,
        err: {
          message: 'No existe el usuario'
        }
      })
    }

    res.json({
      ok: true,
      usuario: deletedUser
    })
  })
})

module.exports = app