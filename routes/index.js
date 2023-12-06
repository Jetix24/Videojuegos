const express = require('express')
const router = express.Router()
const Videogame = require('../models/videogame')

// Ruta para llegar al index general.
router.get('/', async (req, res) => {
    let videogames
    try{
        videogames= await Videogame.find().sort({createdAt: 'desc'}).limit(10).exec()
    }catch{
        videogames = []
    }
    res.render('index', {videogames: videogames})
})

module.exports = router