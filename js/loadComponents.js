// loadComponents.js
async function loadComponent(componentPath, containerId, callback) {
    try {
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }

        const html = await response.text();
        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML = html;
            console.log(`✅ Componente carregado: ${componentPath}`);
            
            // Executa o callback após um pequeno delay para garantir renderização
            if (callback && typeof callback === 'function') {
                setTimeout(callback, 100);
            }
        } else {
            console.warn(`⚠️ Container #${containerId} não encontrado`);
        }
    } catch (erro) {
        console.error(`❌ Erro ao carregar ${componentPath}:`, erro);
    }
}

async function loadComponents() {
    // Carrega o header primeiro
    const headerElement = document.getElementById("header");
    if (headerElement) {
        await loadComponent("../components/header.html", "header");
    }

    // Carrega a sidebar e depois inicializa os eventos
    const sidebarElement = document.getElementById("sidebar");
    if (sidebarElement) {
        await loadComponent("./components/sidebar.html", "sidebar", iniciarSidebar);
    }
}

// Executa quando o DOM estiver completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", loadComponents);
} else {
    // DOM já está pronto (caso o script carregue depois)
    loadComponents();
}