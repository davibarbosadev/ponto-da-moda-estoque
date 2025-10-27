// btnMobile.js
function iniciarSidebar() {
    console.log("🔄 Iniciando sidebar...");

    let tentativas = 0;
    const maxTentativas = 30; // 3 segundos (30 x 100ms)
    
    const inicializar = () => {
        // Busca os elementos no DOM
        const btnMobile = document.querySelector(".navbar__button-mobile");
        const sidebar = document.querySelector(".sidebar");
        const btnSubmenu = document.querySelector(".submenu__button");
        const submenuList = document.querySelector(".submenu__list");

        // Verifica se os elementos essenciais existem
        if (btnMobile && sidebar) {
            console.log("✅ Elementos encontrados, configurando eventos...");

            // ==== EVENTO: Botão Menu Mobile ====
            btnMobile.addEventListener("click", function() {
                const isOpen = btnMobile.classList.toggle("open");
                sidebar.classList.toggle("open");

                console.log(`📱 Menu mobile ${isOpen ? 'aberto' : 'fechado'}`);

                // Fecha o submenu quando fechar a sidebar
                if (!isOpen && btnSubmenu && submenuList) {
                    btnSubmenu.classList.remove("open");
                    submenuList.classList.remove("open");
                }
            });

            // ==== EVENTO: Botão Submenu (opcional) ====
            if (btnSubmenu && submenuList) {
                btnSubmenu.addEventListener("click", function() {
                    const isSubmenuOpen = btnSubmenu.classList.toggle("open");
                    submenuList.classList.toggle("open");
                    
                    console.log(`📂 Submenu ${isSubmenuOpen ? 'aberto' : 'fechado'}`);
                });
            } else {
                console.info("ℹ️ Submenu não encontrado (isso é normal se não houver submenu)");
            }

            // ==== FECHAR SIDEBAR AO CLICAR FORA (Opcional) ====
            document.addEventListener("click", function(event) {
                const clickForaSidebar = !sidebar.contains(event.target) && !btnMobile.contains(event.target);
                
                if (clickForaSidebar && sidebar.classList.contains("open")) {
                    btnMobile.classList.remove("open");
                    sidebar.classList.remove("open");
                    console.log("👆 Sidebar fechada ao clicar fora");
                }
            });

            console.log("✅ Sidebar inicializada com sucesso!");
            return true;
        }

        // Se não encontrou os elementos, tenta novamente
        tentativas++;
        if (tentativas < maxTentativas) {
            setTimeout(inicializar, 100);
        } else {
            console.error("❌ Timeout: Elementos não encontrados após", tentativas, "tentativas");
            console.error("Elementos buscados:", {
                "btnMobile (.navbar__button-mobile)": !!btnMobile,
                "sidebar (.sidebar)": !!sidebar,
                "btnSubmenu (.submenu__button)": !!btnSubmenu,
                "submenuList (.submenu__list)": !!submenuList
            });
        }

        return false;
    };

    // Inicia a primeira tentativa
    inicializar();
}

// Se o script carregar antes do loadComponents, não faz nada
// A função iniciarSidebar será chamada como callback do loadComponent