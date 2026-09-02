import "../sass/main.scss";
import { USERS } from "./users.js";

const formLogin = document.getElementById("loginForm");

if (formLogin) {
    formLogin.addEventListener("submit", (event) => {
        event.preventDefault();

        // O trim() já remove espaços extras no início e no fim
        const inputUsuario = document.getElementById("username").value.trim();
        const inputSenha = document.getElementById("password").value;

        fazerLogin(inputUsuario, inputSenha);
    });
}

function fazerLogin(inputUsuario, inputSenha) {
    // Converte o usuário digitado para minúsculo para garantir a comparação
    const usuarioFormatado = inputUsuario.toLowerCase();

    // Compara o username do array (também em minúsculo) com o que foi digitado
    const user = USERS.find(
        (u) => u.username.toLowerCase() === usuarioFormatado && u.password === inputSenha, // A senha continua case-sensitive
    );

    if (user) {
        localStorage.setItem("logado", "true");
        localStorage.setItem("loginTime", Date.now());
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("username", user.username);
        localStorage.setItem("displayName", user.displayName);

        window.location.href = "/index.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}
