const form = document.querySelector(".form--codigo-mil");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const csvString = document.getElementById("csvInput").value;

    if (!csvString.trim()) {
        console.error("❌ Por favor, insira os dados CSV antes de enviar.");
        return;
    }

    const submitBtn = form.querySelector(".btn--submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
        const response = await fetch("https://api-ponto-da-moda.onrender.com/api/csv", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ csv: csvString }),
        });

        const data = await response.json();
        console.log("📦 Resposta do backend:", data);

        if (response.ok) {
            console.log("✅ Dados enviados com sucesso! Verifique os detalhes acima.");
        } else {
            console.error("❌ Erro ao enviar dados. Verifique se o servidor está rodando em https://api-ponto-da-moda.onrender.com/api");
        }
    } catch (error) {
        console.error("🚫 Erro de conexão. Verifique se o servidor está ativo.", error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Processar Dados";
    }
});