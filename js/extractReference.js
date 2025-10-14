const form = document.querySelector(".form--extract-reference");

// Verifica se o formulário foi encontrado
if (!form) {
    console.error("Formulário '.form--extract-reference' não encontrado");
} else {
    form.addEventListener("submit", handleFormSubmission);
}

async function handleFormSubmission(event) {
    event.preventDefault();

    try {
        const csvInput = form.querySelector('[name="csvInput"]') || form.csvInput;

        if (!csvInput) {
            throw new Error("Campo de entrada CSV não encontrado");
        }

        const csvData = csvInput.value.trim();

        if (!csvData) {
            showMessage("Por favor, insira dados CSV válidos", "warning");
            return;
        }

        const references = extractReferences(csvData);

        if (references.length === 0) {
            showMessage("Nenhuma referência ES07 encontrada nos dados", "info");
            return;
        }

        await copyToClipboard(references);
        clearForm(csvInput);
        showMessage(
            `${references.length} referência(s) copiada(s) para a área de transferência`,
            "success"
        );
    } catch (error) {
        console.error("Erro ao processar formulário:", error);
        showMessage("Erro ao processar os dados. Verifique o formato do CSV.", "error");
    }
}

function extractReferences(csvString) {
    const lines = csvString.split(/\r?\n/).filter((line) => line.trim() !== "");
    const referencesExtracted = [];

    lines.forEach((line, index) => {
        try {
            const columns = parseCSVLine(line);

            if (columns.length < 2) {
                console.warn(`Linha ${index + 1} não possui colunas suficientes:`, line);
                return;
            }

            // Verifica se o dado na primeira coluna é "ES07"
            if (columns[0].trim() === "ES07") {
                const secondColumn = columns[1].trim();

                if (!secondColumn) {
                    console.warn(`Linha ${index + 1}: Segunda coluna está vazia`);
                    return;
                }

                // Extrai a referência - padrão mais flexível
                const reference = extractReferencePattern(secondColumn);

                if (reference && !referencesExtracted.includes(reference)) {
                    referencesExtracted.push(reference);
                }
            }
        } catch (error) {
            console.warn(`Erro ao processar linha ${index + 1}:`, error.message);
        }
    });

    return referencesExtracted;
}

function parseCSVLine(line) {
    // Tratamento mais robusto para CSV com diferentes delimitadores
    const result = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = null;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (!inQuotes && (char === '"' || char === "'")) {
            inQuotes = true;
            quoteChar = char;
        } else if (inQuotes && char === quoteChar) {
            // Verifica se é uma aspa dupla (escape)
            if (line[i + 1] === quoteChar) {
                current += char;
                i++; // Pula a próxima aspa
            } else {
                inQuotes = false;
                quoteChar = null;
            }
        } else if (!inQuotes && char === ";") {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    // Adiciona a última coluna
    result.push(current.trim());

    return result;
}

function extractReferencePattern(text) {
    // Padrões mais flexíveis para extrair referências
    const patterns = [
        /^([A-Z0-9]+(?:-[A-Z0-9]+)*)/, // Padrão principal com hífens
        /^([A-Z]{1,3}\d+[A-Z]*)/, // Padrão alternativo
        /([A-Z0-9]{3,})/, // Fallback para códigos alfanuméricos
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1].length >= 3) {
            return match[1];
        }
    }

    return null;
}

async function copyToClipboard(references) {
    const resultString = references.join(";");

    if (!navigator.clipboard) {
        // Fallback para navegadores mais antigos
        fallbackCopyToClipboard(resultString);
        return;
    }

    try {
        await navigator.clipboard.writeText(resultString);
    } catch (error) {
        console.warn("Clipboard API falhou, usando fallback:", error);
        fallbackCopyToClipboard(resultString);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand("copy");
    } catch (error) {
        console.error("Fallback copy falhou:", error);
        throw new Error("Não foi possível copiar para a área de transferência");
    } finally {
        document.body.removeChild(textArea);
    }
}

function clearForm(csvInput) {
    csvInput.value = "";
    csvInput.focus();
}

function showMessage(message, type = "info") {
    // Procura por um elemento de mensagem existente ou cria um novo
    let messageElement = document.querySelector(".message-display");


    // Define estilos baseados no tipo
    const styles = {
        success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
        error: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
        warning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" },
        info: { backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" },
    };

    const style = styles[type] || styles.info;
    Object.assign(messageElement.style, style);

    messageElement.textContent = message;
    // messageElement.style.opacity = "1";

    messageElement.classList.add("open");

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageElement.classList.remove("open");
    }, 3000);
}


