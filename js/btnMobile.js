function iniciarSidebar() {
    const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
    const sidebar = document.querySelector(".sidebar");
    const buttonSubmenu = document.querySelector(".submenu__button");
    const submenuList = document.querySelector(".submenu__list");
    
    // Sai silenciosamente se elementos essenciais não existirem
    if (!buttonMenuMobile || !sidebar) return;

    buttonMenuMobile.addEventListener("click", function () {
        buttonMenuMobile.classList.toggle("open");
        sidebar.classList.toggle("open");

        // Fecha submenu ao fechar sidebar
        if (buttonSubmenu && submenuList && !buttonMenuMobile.classList.contains("open")) {
            submenuList.classList.remove("open");
            buttonSubmenu.classList.remove("open");
        }
    });

    if (buttonSubmenu && submenuList) {
        buttonSubmenu.addEventListener("click", function () {
            buttonSubmenu.classList.toggle("open");
            submenuList.classList.toggle("open");
        });
    }
}
