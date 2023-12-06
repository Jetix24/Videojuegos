const mongoose = require('mongoose')
const Videogame = require('./videogame')

// Se crea la estructura que tendran los registros de los desarrolladores.
const developerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

// Método que al eliminar a un desarrollador analiza si no tiene un videojuego asosciado y de ser así 
// No lo elimina
developerSchema.pre('findOneAndDelete', async function (next) {
    try {
      const developerId = this.getFilter()._id;
      const videojuegos = await Videojuego.find({ developer: developerId });
  
      if (videojuegos.length > 0) {
        throw new Error('La desarrolladora tiene videojuegos asociadas');
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  });

  // Se exporta el modelo de developer a Mongo.
module.exports = mongoose.model('Developer', developerSchema)