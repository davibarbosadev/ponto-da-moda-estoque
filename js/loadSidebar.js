async function loadSidebar() {
    const container = document.querySelector('.view-container');

    if (!container) return;

    // Evita carregar a sidebar novamente
    if (container.querySelector('.sidebar')) return;

    try {
        const response = await fetch('sidebar.html');

        if (!response.ok) {
            throw new Error(
                `Erro ao carregar sidebar: ${response.status} ${response.statusText}`
            );
        }

        const html = await response.text();

        container.insertAdjacentHTML('afterbegin', html);

    } catch (error) {
        console.error('Não foi possível carregar a sidebar:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadSidebar);


