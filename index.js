// index.js
import './sass/main.scss';

import './js/auth.js';
import './js/menuToggle.js';

import { loadSidebar } from './js/loadSidebar.js';
import { renderUserSummary } from './js/userSummary.js';

// Chamada manual caso o HTML da sidebar seja injetado via JavaScript

// Módulos das telas
import { initProductsPage } from './js/product.js';
import { initCircularPage } from './js/circular.js';
import { initDescriptionProductPage } from './js/descriptionProduct.js';

// Inicializa todos os módulos
// Aguarda o HTML da sidebar ser injetado para depois preencher os dados
loadSidebar().then(() => {
    renderUserSummary();
});

renderUserSummary();
initProductsPage();
initCircularPage();
initDescriptionProductPage();
