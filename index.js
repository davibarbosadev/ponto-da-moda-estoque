// index.js
import './sass/main.scss';

import { initLogoutButton } from './js/auth.js';
import './js/menuToggle.js';

import { loadSidebar } from './js/loadSidebar.js';
import { renderUserSummary } from './js/userSummary.js';

// Módulos das telas
import { initProductsPage } from './js/product.js';
import { initCircularPage } from './js/circular.js';
import { initDescriptionProductPage } from './js/descriptionProduct.js';

// Aguarda a sidebar injetar o HTML no DOM para então preencher os dados do usuário e ativar o logout
loadSidebar().then(() => {
    renderUserSummary();
    initLogoutButton();
});

// Outros módulos das telas
initProductsPage();
initCircularPage();
initDescriptionProductPage();