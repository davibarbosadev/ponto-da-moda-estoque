import '../sass/main.scss'

import { LOGIN } from "./config.js";

const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = form.querySelector("#username").value.trim();
        const password = form.querySelector("#password").value.trim();
        const submitBtn = form.querySelector(".form-submit");

        console.log(submitBtn.value)

        submitBtn.textContent = "Entrando...";
        submitBtn.disabled = true;

        const inputUser = username.toLowerCase();
        const inputPass = password.toLowerCase();
        const validUser = LOGIN.USER.toLowerCase();
        const validPass = LOGIN.PASSWORD.toLowerCase();

        setTimeout(() => {
            if (inputUser === validUser && inputPass === validPass) {
                localStorage.setItem("logado", "true");
                localStorage.setItem("loginTime", Date.now()); // salva o horário do login
                window.location.href = "index.html";
            } else {
                alert("Usuário ou senha incorretos!");
                submitBtn.textContent = "Entrar";
                submitBtn.disabled = false;
            }
        }, 1500);
    });
}
