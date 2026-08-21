// index.js
import './sass/main.scss';

import './js/auth.js';
import './js/menuToggle.js';

import { loadSidebar } from './js/loadSidebar.js';
loadSidebar();

// Módulos das telas
import { initProductsPage } from './js/product.js';
import { initCircularPage } from './js/circular.js';
import { initDescriptionProductPage } from './js/descriptionProduct.js';

// Inicializa todos os módulos
initProductsPage();
initCircularPage();
initDescriptionProductPage();
