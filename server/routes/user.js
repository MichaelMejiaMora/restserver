const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user')

const app = express()

app.get('/usuario', (req, res) => {
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

app.post('/usuario', (req, res) => {
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

app.put('/usuario/:id', (req, res) => {
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

app.delete('/usuario/:id', (req, res) => {
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