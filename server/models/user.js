// ====================================
// Importando librerías externas
// ====================================
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Define los roles válidos
const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}
// Define un nuevo esquema de BD
let Schema = mongoose.Schema

// Define una nueva instancia de Schema
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

// Eliminamos la propiedad password antes de regresarlo como respuesta JSON
userSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  delete userObject.password
  return userObject
}

// Usamos mensaje personalizado para la validación de campos únicos
userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

// Exportamos el modelo de mongoDB, con el nombre 'User', basado en userSchema
module.exports = mongoose.model('User', userSchema)