function loadComponent(component, containerId, callback) {
    fetch(component)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = html;
            if (callback) callback();
        })
        .catch(err => console.error(`Erro ao carregar o componente ${component}:`, err));
}

function loadComponents() {
    if (document.getElementById("header")) {
        loadComponent("./components/header.html", "header");
    }

    if (document.getElementById("sidebar")) {
        loadComponent("./components/sidebar.html", "sidebar", iniciarSidebar);
    }
}

document.addEventListener("DOMContentLoaded", loadComponents);
