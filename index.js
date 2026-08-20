// index.js
import './sass/main.scss';

import './js/auth.js';
import './js/menuToggle.js';

import { loadSidebar } from './js/loadSidebar.js';
loadSidebar();

// Módulos das telas
import { initProductsPage } from './js/product.js';
import { initCircularPage } from './js/circular.js';
import { initDescriptionAutoPage } from './js/descriptionAuto.js';
import { initDescriptionManualPage } from './js/descriptionProduct.js'; // <-- Importado aqui

// Inicializa todos os módulos
initProductsPage();
initCircularPage();
initDescriptionAutoPage();
initDescriptionManualPage(); // <-- Inicializado aqui