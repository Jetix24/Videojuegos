const express = require('express')
const router = express.Router()
const Videogame = require('../models/videogame')
const Developer = require('../models/developer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Rutas para los videojuegos
router.get('/', async (req, res) => {
    let query = Videogame.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const videogames = await query.exec()
        res.render('videogames/index', {
            videogames: videogames,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//Nuevo videojuego
router.get('/new', async (req, res) => {
    renderNewPage(res, new Videogame())
})

//Crear videojuego
router.post('/',  async (req, res) => {
    const videogame = new Videogame({
        title: req.body.title,
        developer: req.body.developer,
        publishDate: new Date(req.body.publishDate),
        size: req.body.size,
        description: req.body.description
   })
   saveCover(videogame, req.body.cover)

    try{
        const newVideogame = await videogame.save()
        res.redirect('videogames/${newVideogame.id}')
    }catch(error){
        renderNewPage(res, videogame, true)
   }
})

//Mostrar videojuegos
router.get('/:id', async (req, res) => {
    try {
      const videogame = await Videogame.findById(req.params.id)
                             .populate('developer')
                             .exec()
      res.render('videogames/show', { videogame: videogame })
    } catch {
      res.redirect('/')
    }
  })
  
  // Editar videojuego
  router.get('/:id/edit', async (req, res) => {
    try {
      const videogame = await Videogame.findById(req.params.id)
      renderEditPage(res, videogame)
    } catch {
      res.redirect('/')
    }
  })
  
  // Update Videogame Route 
  router.put('/:id', async (req, res) => {
    let videogame
    // Obtendra los datos de los registros
    try {
      videogame = await Videogame.findById(req.params.id)
      videogame.title = req.body.title
      videogame.developer = req.body.developer
      videogame.publishDate = new Date(req.body.publishDate)
      videogame.size = req.body.size
      videogame.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(videogame, req.body.cover)
      }
      await videogame.save()
      res.redirect(`/videogames/${videogame.id}`)
    } catch {
      if (videogame != null) {
        renderEditPage(res, videogame, true)
      } else {
        redirect('/')
      }
    }
  }) 
  
  // Delete Videogame 
  router.delete('/:id', async (req, res) => {
    let videogame
    try {
      videogame = await Videogame.findById(req.params.id)
      await videogame.deleteOne()
      res.redirect('/videogames')
    } catch {
      if (videogame != null) {
        res.render('videogames/show', {
          videogame: videogame,
          errorMessage: 'No se pudo borrar el videojuego'
        })
      } else {
        res.redirect('/')
      }
    }
  })

// Crea la imagen
async function renderNewPage(res, videogame, hasError = false){
    renderFormPage(res, videogame, 'new', hasError)
}

//Carga el nuevo formulario en donde se actualizara
async function renderFormPage(res, videogame, form, hasError = false){
    try{
        const developers = await Developer.find({})
        const params = {
            developers: developers,
            videogame: videogame
        }
        if (hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error al actualizar el videojuego'
            } else {
                params.errorMessage = 'Error al crear el videojuego'
            }
        }
        res.render(`videogames/${form}`, params)
    } catch {
        res.redirect('/videogames')
    }
}

// Si sucede un error cargara la pagina de editar con un mensaje.
async function renderEditPage(res, videogame, hasError = false){
    renderFormPage(res, videogame, 'edit', hasError)
}
// Verifica la codificación de la imagen para así mostrarla
function saveCover(videogame, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      videogame.coverImage = new Buffer.from(cover.data, 'base64')
      videogame.coverImageType = cover.type
    }
  }

module.exports = router