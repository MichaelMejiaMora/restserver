const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema

let userSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email:{
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

//  Quitamos la propiedad del objeto user antes de regresarlo como respuesta JSON
userSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  delete userObject.password
  return userObject
}

// Usamos mensaje personalizado para la validación de campos únicos
userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('User', userSchema)