// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // Páginas da Raiz
                main: resolve(import.meta.dirname, 'index.html'),
                login: resolve(import.meta.dirname, 'login.html'),
                descricaoProduto: resolve(import.meta.dirname, 'descricao-produto.html'),
                descricaoProdutoManual: resolve(import.meta.dirname, 'descricao-produto-manual.html'),
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