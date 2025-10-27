// // // Função para carregar um componente e chamar callback apenas se o container existir
// // async function loadComponent(component, containerId, callback) {
// //     try {
// //         const response = await fetch(component);
// //         if (!response.ok) throw new Error(`HTTP ${response.status}`);

// //         const html = await response.text();
// //         const container = document.getElementById(containerId);

// //         if (container) {
// //             container.innerHTML = html;
// //             if (callback) callback();
// //         } else {
// //             console.info(`Container #${containerId} não encontrado. Componente ${component} não foi inserido.`);
// //         }
// //     } catch (err) {
// //         console.error(`Erro ao carregar o componente ${component}:`, err);
// //     }
// // }

// // // Função principal para carregar todos os componentes
// // function loadComponents() {
// //     if (document.getElementById("header")) {
// //         loadComponent("./components/header.html", "header");
// //     }

// //     if (document.getElementById("sidebar")) {
// //         loadComponent("./components/sidebar.html", "sidebar", iniciarSidebar);
// //     }
// // }

// // // Executa quando o DOM principal estiver pronto
// // document.addEventListener("DOMContentLoaded", loadComponents);


// // Função para carregar um componente e chamar callback apenas se o container existir
// async function loadComponent(component, containerId, callback) {
//     try {
//         const response = await fetch(component);
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const html = await response.text();
//         const container = document.getElementById(containerId);

//         if (container) {
//             container.innerHTML = html;
//             if (callback) callback(); // chama callback somente se container existe
//         } else {
//             console.info(`Container #${containerId} não encontrado. Componente ${component} não foi inserido.`);
//         }
//     } catch (err) {
//         console.error(`Erro ao carregar o componente ${component}:`, err);
//     }
// }

// // Função principal para carregar todos os componentes
// async function loadComponents() {
//     if (document.getElementById("header")) {
//         await loadComponent("./components/header.html", "header");
//     }

//     if (document.getElementById("sidebar")) {
//         await loadComponent("./components/sidebar.html", "sidebar", iniciarSidebar);
//     }
// }

// // Executa quando o DOM principal estiver pronto
// document.addEventListener("DOMContentLoaded", loadComponents);


// arquivo: component-loader.js
async function loadComponent(component, containerId, callback) {
    try {
        const response = await fetch(component);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML = html;
            if (callback) callback();
        } else {
            console.info(`Container #${containerId} não encontrado. Componente ${component} não foi inserido.`);
        }
    } catch (err) {
        console.error(`Erro ao carregar o componente ${component}:`, err);
    }
}

async function loadComponents() {
    if (document.getElementById("header")) {
        await loadComponent("/components/header.html", "header"); // Caminho absoluto
    }

    if (document.getElementById("sidebar")) {
        await loadComponent("/components/sidebar.html", "sidebar", iniciarSidebar);
    }
}

document.addEventListener("DOMContentLoaded", loadComponents);