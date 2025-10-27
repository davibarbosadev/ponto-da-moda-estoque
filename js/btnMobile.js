// // function iniciarSidebar() {
// //     const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
// //     const sidebar = document.querySelector(".sidebar");
// //     const buttonSubmenu = document.querySelector(".submenu__button");
// //     const submenuList = document.querySelector(".submenu__list");
    
// //     // Sai silenciosamente se elementos essenciais não existirem
// //     if (!buttonMenuMobile || !sidebar) return;

// //     buttonMenuMobile.addEventListener("click", function () {
// //         buttonMenuMobile.classList.toggle("open");
// //         sidebar.classList.toggle("open");

// //         // Fecha submenu ao fechar sidebar
// //         if (buttonSubmenu && submenuList && !buttonMenuMobile.classList.contains("open")) {
// //             submenuList.classList.remove("open");
// //             buttonSubmenu.classList.remove("open");
// //         }
// //     });

// //     if (buttonSubmenu && submenuList) {
// //         buttonSubmenu.addEventListener("click", function () {
// //             buttonSubmenu.classList.toggle("open");
// //             submenuList.classList.toggle("open");
// //         });
// //     }
// // }


// // function iniciarSidebar() {
// //     const observer = new MutationObserver(() => {
// //         const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
// //         const sidebar = document.querySelector(".sidebar");
// //         const buttonSubmenu = document.querySelector(".submenu__button");
// //         const submenuList = document.querySelector(".submenu__list");

// //         if (buttonMenuMobile && sidebar) {
// //             // Liga os eventos
// //             buttonMenuMobile.addEventListener("click", () => {
// //                 buttonMenuMobile.classList.toggle("open");
// //                 sidebar.classList.toggle("open");
// //                 if (buttonSubmenu && submenuList && !buttonMenuMobile.classList.contains("open")) {
// //                     submenuList.classList.remove("open");
// //                     buttonSubmenu.classList.remove("open");
// //                 }
// //             });

// //             if (buttonSubmenu && submenuList) {
// //                 buttonSubmenu.addEventListener("click", () => {
// //                     buttonSubmenu.classList.toggle("open");
// //                     submenuList.classList.toggle("open");
// //                 });
// //             }

// //             observer.disconnect(); // Para de observar quando tudo estiver pronto
// //         }
// //     });

// //     observer.observe(document.body, { childList: true, subtree: true });
// // }


// function iniciarSidebar() {
//     const observer = new MutationObserver(() => {
//         const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
//         const sidebar = document.querySelector(".sidebar");
//         const buttonSubmenu = document.querySelector(".submenu__button");
//         const submenuList = document.querySelector(".submenu__list");

//         // Só inicializa quando os elementos essenciais existirem
//         if (buttonMenuMobile && sidebar) {
//             // Adiciona evento do botão principal
//             buttonMenuMobile.addEventListener("click", () => {
//                 buttonMenuMobile.classList.toggle("open");
//                 sidebar.classList.toggle("open");

//                 // Fecha submenu ao fechar sidebar
//                 if (buttonSubmenu && submenuList && !buttonMenuMobile.classList.contains("open")) {
//                     submenuList.classList.remove("open");
//                     buttonSubmenu.classList.remove("open");
//                 }
//             });

//             // Adiciona evento do submenu, se existir
//             if (buttonSubmenu && submenuList) {
//                 buttonSubmenu.addEventListener("click", () => {
//                     buttonSubmenu.classList.toggle("open");
//                     submenuList.classList.toggle("open");
//                 });
//             }

//             observer.disconnect(); // Para de observar quando tudo estiver pronto
//         }
//     });

//     // Observa mudanças no DOM inteiro
//     observer.observe(document.body, { childList: true, subtree: true });
// }


// arquivo: sidebar.js
function iniciarSidebar() {
    let eventListenersAdded = false; // Flag para prevenir duplicação
    let timeoutId;

    const observer = new MutationObserver(() => {
        const buttonMenuMobile = document.querySelector(".navbar__button-mobile");
        const sidebar = document.querySelector(".sidebar");
        const buttonSubmenu = document.querySelector(".submenu__button");
        const submenuList = document.querySelector(".submenu__list");

        // Só inicializa uma vez e quando os elementos essenciais existirem
        if (buttonMenuMobile && sidebar && !eventListenersAdded) {
            eventListenersAdded = true;

            // Adiciona evento do botão principal
            buttonMenuMobile.addEventListener("click", function toggleMenu() {
                buttonMenuMobile.classList.toggle("open");
                sidebar.classList.toggle("open");

                // Fecha submenu ao fechar sidebar
                if (buttonSubmenu && submenuList && !buttonMenuMobile.classList.contains("open")) {
                    submenuList.classList.remove("open");
                    buttonSubmenu.classList.remove("open");
                }
            });

            // Adiciona evento do submenu, se existir
            if (buttonSubmenu && submenuList) {
                buttonSubmenu.addEventListener("click", function toggleSubmenu() {
                    buttonSubmenu.classList.toggle("open");
                    submenuList.classList.toggle("open");
                });
            }

            observer.disconnect(); // Para de observar quando tudo estiver pronto
            clearTimeout(timeoutId); // Limpa o timeout
        }
    });

    // Timeout de segurança: desconecta observer após 5 segundos
    timeoutId = setTimeout(() => {
        observer.disconnect();
        console.warn("Sidebar: Timeout atingido. Elementos não encontrados.");
    }, 5000);

    // Observa mudanças no DOM
    observer.observe(document.body, { childList: true, subtree: true });
}