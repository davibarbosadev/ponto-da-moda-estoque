// js/userSummary.js

export function renderUserSummary() {
    const nameElement = document.querySelector(".user-summary__name");
    const roleElement = document.querySelector(".user-summary__role");
    const avatarElement = document.querySelector(".user-summary__avatar");

    if (!nameElement || !roleElement || !avatarElement) return;

    // Resgata os dados do localStorage
    const displayName = localStorage.getItem("displayName") || localStorage.getItem("username") || "Usuário";
    const userRole = localStorage.getItem("userRole") || "usuario";

    // Formata o perfil de acesso
    const formattedRole = userRole === "admin" ? "Administrador" : "Usuário";

    // Lógica para gerar as iniciais do avatar
    const nameParts = displayName.trim().split(/\s+/);
    let avatarInitials = "";

    if (nameParts.length > 1) {
        // Nome composto: pega a 1ª letra do primeiro nome + 1ª letra do último nome
        const firstLetter = nameParts[0].charAt(0);
        const lastLetter = nameParts[nameParts.length - 1].charAt(0);
        avatarInitials = `${firstLetter}${lastLetter}`.toUpperCase();
    } else if (displayName.length >= 2) {
        // Nome simples com 2+ letras: pega as duas primeiras letras
        avatarInitials = displayName.substring(0, 2).toUpperCase();
    } else {
        // Fallback para nomes de 1 letra
        avatarInitials = displayName.toUpperCase();
    }

    // Injeta os dados no HTML
    nameElement.textContent = displayName;
    roleElement.textContent = formattedRole;
    avatarElement.textContent = avatarInitials;
}

document.addEventListener("DOMContentLoaded", renderUserSummary);