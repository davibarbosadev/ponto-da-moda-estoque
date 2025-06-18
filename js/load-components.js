// Função genérica para carregar qualquer componente HTML dinamicamente
function loadComponent(component, containerId) {
    fetch(component)
        .then((response) => response.text())
        .then((data) => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch((error) => console.error(`Erro ao carregar o componente ${component}:`, error));
}

// Função para carregar todos os componentes
function loadComponents() {
    loadComponent("components/header.html", "header");
    loadComponent("components/sidebar.html", "sidebar");
    //   loadComponent('footer.html', 'footer-container');
}

// Carregar os componentes assim que a página for carregada
document.addEventListener("DOMContentLoaded", loadComponents);
