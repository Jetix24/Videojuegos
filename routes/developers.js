// Constantes que guardan las rutas
const express = require('express')
const router = express.Router()
const Developer = require('../models/developer')
const Videogame = require('../models/videogame')

//Rutas para los developers
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const developers = await Developer.find(searchOptions)
        res.render('developers/index',  { 
            developers: developers, 
            searchOptions : req.query
        })
    } catch{
        res.redirect('/')
    }    
})

//Nuevo developer
router.get('/new', (req, res) => {
    res.render('developers/new', {developer: new Developer()})
})

//Crear developer
router.post('/', async (req, res) => {
    const developer = new Developer({
        name: req.body.name
    })
    try {
        const newDeveloper = await developer.save();
        res.redirect(`developers/${newDeveloper.id}`);
    } catch (err) {
        res.render('developers/new', {
            developer: developer,
            errorMessage: 'Error creando una desarrolladora'
        });
    }
})

//Mostrar
router.get('/:id', async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id)
        const videogames = await Videogame.find({ developer: developer.id }).limit(6).exec()
        res.render('developers/show', {
          developer: developer,
          videogamesByDeveloper: videogames
        })
      } catch {
        res.redirect('/')
      }
})

//Ir a editar
router.get('/:id/edit', async (req, res) => {
    try{
        const developer = await Developer.findById(req.params.id)
        res.render('developers/edit', {developer: developer})
    }catch{
        res.redirect('/developers')
    }
})

//Guardar editar
router.put('/:id', async (req, res) => {
    let developer
    try {
      developer = await Developer.findById(req.params.id)
      developer.name = req.body.name
      await developer.save()
      res.redirect(`/developers/${developer.id}`)
    } catch {
      if (developer == null) {
        res.redirect('/')
      } else {
        res.render('developers/edit', {
          developer: developer,
          errorMessage: 'Error al actualizar la Desarroladora'
        })
      }
    }
  })
  
//Borrar una desarrolladora
router.delete('/:id', async (req, res) => {
    let developer;
    try {
      developer = await Developer.findById(req.params.id);
      await Developer.findOneAndDelete({_id: req.params.id});
      res.redirect('/developers');
    } catch (error) {
      if (developer == null) {
        res.redirect('/');
      } else {
        res.redirect(`/developers/${developer.id}`);
      }
    }
  });

module.exports = router