// js/auth.js

const LOGIN_DURATION = 30 * 60 * 1000; // 30 minutos

const isLogged = localStorage.getItem("logado") === "true";
const loginTime = localStorage.getItem("loginTime");
const userRole = localStorage.getItem("userRole");

// Normaliza o caminho atual ignorando barras no final e Query Parameters
const currentPath = window.location.pathname.toLowerCase();

// Verifica se a página atual é de login (abrange /login.html, /login, /login/)
const isLoginPage = currentPath.endsWith("login.html") || currentPath.endsWith("/login") || currentPath === "/login/";

if (!isLoginPage) {
    // Se NÃO estiver na página de login, valida a sessão
    if (!isLogged || !loginTime) {
        window.location.href = "/login.html"; // Usa barra inicial para garantir a raiz
    } else {
        const now = Date.now();
        const elapsed = now - Number(loginTime);

        if (elapsed > LOGIN_DURATION) {
            localStorage.removeItem("logado");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("userRole");
            localStorage.removeItem("username");
            alert("Sua sessão expirou. Faça login novamente.");
            window.location.href = "/login.html";
        } else {
            // Atualiza o timestamp da sessão mantendo-a ativa
            localStorage.setItem("loginTime", Date.now());
        }
    }
} else {
    // Se o usuário JÁ está logado e tenta abrir a página de login, redireciona direto para o painel
    if (isLogged && loginTime) {
        const now = Date.now();
        const elapsed = now - Number(loginTime);

        if (elapsed <= LOGIN_DURATION) {
            window.location.href = "/index.html";
        }
    }
}