// document.addEventListener("click", (e) => {
//     const menuToggle = e.target.closest(".menu-toggle")
//     if (!menuToggle) return

//     menuToggle.classList.toggle("open")
// })

document.addEventListener("click", (e) => {
    const menuToggle = e.target.closest(".menu-toggle")
    if (!menuToggle) return

    // Seleciona o menu de navegação
    const navigation = document.querySelector(".navigation")

    // Alterna a classe 'open' em ambos os elementos
    menuToggle.classList.toggle("open")

    if (navigation) {
        navigation.classList.toggle("open")
    }
})