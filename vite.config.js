// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        target: 'es2022', // Garante suporte CSS moderno (como backdrop-filter) no build final
        rollupOptions: {
            input: {
                // Páginas da Raiz
                login: resolve(import.meta.dirname, 'login.html'),
                main: resolve(import.meta.dirname, 'index.html'),
                descricaoProduto: resolve(import.meta.dirname, 'descricao-produto.html'),
                circular: resolve(import.meta.dirname, 'circular.html'),
                produtos: resolve(import.meta.dirname, 'produtos.html'),
                print: resolve(import.meta.dirname, 'print.html'),

                // Páginas da Área Administrativa (/admin)
                admin: resolve(import.meta.dirname, 'admin/index.html'),
                adminDescricaoProduto: resolve(import.meta.dirname, 'admin/descricao-produto.html'),
            },
        },
    },
});