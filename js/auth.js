// Tempo máximo de login: 30 minutos (em milissegundos)
const LOGIN_DURATION = 30 * 60 * 1000;

const isLogged = localStorage.getItem("logado") === "true";
const loginTime = localStorage.getItem("loginTime");

// Se não estiver logado ou sem horário de login salvo → volta para login
if (!isLogged || !loginTime) {
  window.location.href = "login.html";
} else {
  const now = Date.now();
  const elapsed = now - Number(loginTime);

  if (elapsed > LOGIN_DURATION) {
    // Tempo expirou → limpa dados e redireciona
    localStorage.removeItem("logado");
    localStorage.removeItem("loginTime");
    alert("Sua sessão expirou. Faça login novamente.");
    window.location.href = "login.html";
  } else {
    // (Opcional) atualiza o horário do login a cada visita
    // Isso faz a sessão se renovar enquanto o usuário estiver ativo
    localStorage.setItem("loginTime", Date.now());
  }
}
