function iniciarSidebar() {
    const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
    const sidebar = document.querySelector(".sidebar");
    const buttonSubmenu = document.querySelector(".submenu__button");
    const submenuList = document.querySelector(".submenu__list");

    buttonMenuMobile.addEventListener("click", function () {
        buttonMenuMobile.classList.toggle("open");
        sidebar.classList.toggle("open");

        if (!buttonMenuMobile.classList.contains("open")) {
            submenuList.classList.remove("open");
            buttonSubmenu.classList.remove("open");
        }
    });

    buttonSubmenu.addEventListener("click", function () {
        buttonSubmenu.classList.toggle("open");
        submenuList.classList.toggle("open");
    });
}

setTimeout(() => {
    iniciarSidebar();
}, 1000);



