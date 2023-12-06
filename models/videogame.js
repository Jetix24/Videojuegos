const mongoose = require('mongoose')

// Se crea la estructura que tendran los registros de los videojuegos.
const videogameSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    publishDate:{
        type: Date,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
      type: Buffer,
      required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    developer:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Developer'
    },
})

// Codifica la imagen para que en si se guarde la imagen en la base de datos.
videogameSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

// Se exporta el modelo de videojuegos a Mongo.
module.exports = mongoose.model('Videogame', videogameSchema)