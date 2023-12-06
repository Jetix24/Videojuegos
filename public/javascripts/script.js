// Función que controlara el menu lateral.
window.onload = function(){
    // Relaciona las variables con la clase sidebar así como el id btn.
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    
    // Es un listener que al hacer click a la clase sidebar le agregara el parametrp sidebar, así como ejecutar la función menuBtnChange.
    closeBtn.addEventListener("click", function(){
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    // Verifica si el el menu tiene el paramtero opens, si no abrira el menu.
    function menuBtnChange(){
        if (sidebar.classList.contains("open")){
            closeBtn.classList.replace("bx-menu","bx-menu-alt-right")
        }else{
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu")

        }
    }
}