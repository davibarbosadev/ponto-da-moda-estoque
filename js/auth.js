// Tempo máximo de login: 30 minutos (em milissegundos)
const LOGIN_DURATION = 30 * 60 * 1000;

const isLogged = localStorage.getItem("logado") === "true";
const loginTime = localStorage.getItem("loginTime");
const isLoginPage = window.location.pathname.includes("login.html");

// Executa a validação apenas se NÃO estiver na página de login
if (!isLoginPage) {
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
      // Atualiza o horário do login a cada visita mantendo a sessão ativa
      localStorage.setItem("loginTime", Date.now());
    }
  }
}