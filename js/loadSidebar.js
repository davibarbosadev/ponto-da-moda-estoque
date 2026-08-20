export async function loadSidebar(sidebarPath = '/sidebar.html') {
    const container = document.querySelector('.view-container');

    if (!container) return;
    if (container.querySelector('.sidebar')) return;

    try {
        const response = await fetch(sidebarPath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar sidebar: ${response.status}`);
        }

        const html = await response.text();
        container.insertAdjacentHTML('afterbegin', html);

    } catch (error) {
        console.error('Erro ao carregar sidebar:', error);
    }
}