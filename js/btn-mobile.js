const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
const navbar = document.querySelector(".navbar")
const buttonSubmenu = document.querySelector(".submenu__button");
const submenuList = document.querySelector(".submenu__list");


buttonMenuMobile.addEventListener("click", function () {
    navbar.classList.toggle("open");

    if (!navbar.classList.contains("open")) {
        submenuList.classList.remove("open");
    }
});


buttonSubmenu.addEventListener("click", function () {
    buttonSubmenu.classList.toggle("open");
    submenuList.classList.toggle("open")
});