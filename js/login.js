import "../sass/main.scss";
import { USERS } from './users.js';

const formLogin = document.getElementById("loginForm");

if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
        event.preventDefault();

        const inputUsuario = document.getElementById("username").value.trim();
        const inputSenha = document.getElementById("password").value;

        fazerLogin(inputUsuario, inputSenha);
    });
}

function fazerLogin(inputUsuario, inputSenha) {
    const user = USERS.find(u => u.username === inputUsuario && u.password === inputSenha);

    if (user) {
        localStorage.setItem("logado", "true");
        localStorage.setItem("loginTime", Date.now());
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("username", user.username);
        localStorage.setItem("displayName", user.displayName); // <-- Salva o nome de exibição

        window.location.href = "/index.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}