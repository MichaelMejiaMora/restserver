// =========================
//      Librerías externas
// =========================
const jwt = require('jsonwebtoken')

// =========================
//      Verificar token
// =========================
let verificaToken = (req,res,next) => {

  let token = req.get('token')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err){
      return res.status(401).json({
        ok: false,
        err
      })
    }

    req.usuario = decoded.usuario
    next()
  })
  
}

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario
  if(usuario.role !== 'ADMIN_ROLE') {
    return res.status(403).json({
      ok: false,
      err: {
        message: 'No posee los privilegios necesarios'
      }
    })
  }

  next()
}
module.exports = {
  verificaToken,
  verificaAdmin_Role
}

