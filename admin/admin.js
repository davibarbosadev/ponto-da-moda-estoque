// admin.js
import '../sass/main.scss';

import { initLogoutButton } from '../js/auth.js';
import '../js/menuToggle.js';

import { loadSidebar } from '../js/loadSidebar.js';
import { renderUserSummary } from '../js/userSummary.js';

// Aguarda a sidebar injetar o HTML no DOM para então preencher os dados do usuário e ativar o logout
loadSidebar('/admin/sidebar.html').then(() => {
    renderUserSummary();
    initLogoutButton();
});