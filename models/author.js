const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', function(next){
    Book.find({author: this.id}, (err, books) =>{
        if(err){
            next(err)
        } else if (books.length > 0) {
            next(new Error('El autor aun tiene libros publicados '))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)