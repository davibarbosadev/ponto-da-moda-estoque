// js/auth.js

const LOGIN_DURATION = 30 * 60 * 1000; // 30 minutos

const isLogged = localStorage.getItem("logado") === "true";
const loginTime = localStorage.getItem("loginTime");
const userRole = localStorage.getItem("userRole");

const currentPath = window.location.pathname.toLowerCase();
const isLoginPage = currentPath.endsWith("login.html") || currentPath.endsWith("/login") || currentPath === "/login/";

if (!isLoginPage) {
    if (!isLogged || !loginTime) {
        window.location.href = "/login.html";
    } else {
        const now = Date.now();
        const elapsed = now - Number(loginTime);

        if (elapsed > LOGIN_DURATION) {
            limparSessao();
            alert("Sua sessão expirou. Faça login novamente.");
            window.location.href = "/login.html";
        } else {
            localStorage.setItem("loginTime", Date.now());
        }
    }
} else {
    if (isLogged && loginTime) {
        const now = Date.now();
        const elapsed = now - Number(loginTime);

        if (elapsed <= LOGIN_DURATION) {
            window.location.href = "/index.html";
        }
    }
}

// Limpa todas as chaves criadas no fazerLogin
function limparSessao() {
    localStorage.removeItem("logado");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
}

// Função exportada para o index.js
export function initLogoutButton() {
    const logoutBtn = document.getElementById("btnLogout");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        limparSessao();
        window.location.href = "/login.html";
    });
}