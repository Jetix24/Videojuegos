// Se define el estilo que tendra el input en donde se subirá la imagen.
const rootStyles = window.getComputedStyle(document.documentElement)

// Analiza si tiene el tamaño adecuado y se corre la función ready. 
if (rootStyles.getPropertyValue('--videogame-cover-width-large') != null && rootStyles.getPropertyValue('--videogame-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

// La función ready 
function ready() {
  // Se obtienen las variables del css y las relaciona con variables.
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--videogame-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--videogame-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  // Registra la imagen.
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  // Define el tamaño que tendra la imagen
  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })
  // La muestra en el apartado del body
  FilePond.parse(document.body)
}