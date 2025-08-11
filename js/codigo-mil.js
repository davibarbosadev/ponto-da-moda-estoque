// const form = document.querySelector(".form--codigo-mil");

// form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const csvString = document.getElementById("csvInput").value;

//     if (!csvString.trim()) {
//         console.error("❌ Por favor, insira os dados CSV antes de enviar.");
//         return;
//     }

//     const submitBtn = form.querySelector(".btn--submit");
//     submitBtn.disabled = true;
//     submitBtn.textContent = "Enviando...";

//     try {
//         const response = await fetch("http://localhost:3000/api/csv", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ csv: csvString }),
//         });

//         const data = await response.json();
//         console.log("📦 Resposta do backend:", data);

//         if (response.ok) {
//             console.log("✅ Dados enviados com sucesso! Verifique os detalhes acima.");
//         } else {
//             console.error("❌ Erro ao enviar dados. Verifique se o servidor está rodando em http://localhost:3000");
//         }
//     } catch (error) {
//         console.error("🚫 Erro de conexão. Verifique se o servidor está ativo.", error);
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.textContent = "Processar Dados";
//     }
// });

// Redirecionamento por botão
// document.addEventListener("DOMContentLoaded", () => {
//   const buttons = document.querySelectorAll(".container-links button");
//   const storeSelect = document.getElementById("storeSelect");

//   buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const startReference = btn.dataset.startReference;
//       const store = storeSelect.value;
//       const dateStart = document.querySelector("#dateStart").value
//       const dateEnd = document.querySelector("#dateEnd").value

//       if (!store) {
//         alert("Por favor, selecione uma loja antes de continuar.");
//         return;
//       }

//       // Monta a URL com os dois parâmetros
//       console.log(dateStart)
//       console.log(dateEnd)
//       const url = new URL("conferencia.html", window.location.origin);
//       url.searchParams.set("startReference", startReference);
//       url.searchParams.set("store", store);
//       url.searchParams.set("dateStart", dateStart);
//       url.searchParams.set("dateEnd", dateEnd);

//       // Navega para a página com os parâmetros
//       window.location.href = url.toString();
//     });
//   });
// });


// ===== SISTEMA DE CÓDIGO MIL =====
// Script responsável pela funcionalidade da página de código mil

// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener("DOMContentLoaded", () => {
    
    // ===== SELEÇÃO DE ELEMENTOS DO DOM =====
    
    // Seleciona todos os botões de ação
    const actionButtons = document.querySelectorAll(".reference-button");
    // Seleciona o campo de seleção da loja
    const storeSelect = document.getElementById("storeSelect");
    // Seleciona os campos de data
    const dateStart = document.getElementById("dateStart");
    const dateEnd = document.getElementById("dateEnd");
    // Container para exibir mensagens
    const messageContainer = document.getElementById("messageContainer");
    // Formulário principal
    const form = document.getElementById("codigoMilForm");
    
    // ===== FUNÇÕES DE MENSAGENS =====
    
    /**
     * Exibe mensagem de erro na interface
     * @param {string} message - Mensagem de erro a ser exibida
     */
    function showError(message) {
        // Limpa mensagens anteriores
        messageContainer.innerHTML = '';
        
        // Cria elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Adiciona ao container
        messageContainer.appendChild(errorDiv);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
        
        // Faz scroll suave para a mensagem
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Exibe mensagem de sucesso na interface
     * @param {string} message - Mensagem de sucesso a ser exibida
     */
    function showSuccess(message) {
        // Limpa mensagens anteriores
        messageContainer.innerHTML = '';
        
        // Cria elemento de sucesso
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Adiciona ao container
        messageContainer.appendChild(successDiv);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    /**
     * Limpa todas as mensagens da interface
     */
    function clearMessages() {
        messageContainer.innerHTML = '';
    }
    
    // ===== FUNÇÕES DE VALIDAÇÃO =====
    
    /**
     * Valida se uma data está no formato correto
     * @param {string} dateString - String da data a ser validada
     * @returns {boolean} - True se a data for válida
     */
    function isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Valida se a data inicial é anterior ou igual à data final
     * @param {string} startDate - Data inicial
     * @param {string} endDate - Data final
     * @returns {boolean} - True se as datas estiverem em ordem correta
     */
    function validateDateRange(startDate, endDate) {
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return false;
        }
        return new Date(startDate) <= new Date(endDate);
    }

    /**
     * Valida todos os campos do formulário
     * @returns {Object} - Objeto com resultado da validação e dados
     */
    function validateForm() {
        const store = storeSelect.value.trim();
        const startDate = dateStart.value;
        const endDate = dateEnd.value;

        // Remove classes de erro anteriores
        [storeSelect, dateStart, dateEnd].forEach(element => {
            element.classList.remove('error');
        });

        // Verifica se a loja foi selecionada
        if (!store) {
            showError("Por favor, selecione uma loja antes de continuar.");
            storeSelect.classList.add('error');
            storeSelect.focus();
            return { isValid: false };
        }

        // Verifica se a data inicial foi preenchida
        if (!startDate) {
            showError("Por favor, selecione uma data inicial.");
            dateStart.classList.add('error');
            dateStart.focus();
            return { isValid: false };
        }

        // Verifica se a data final foi preenchida
        if (!endDate) {
            showError("Por favor, selecione uma data final.");
            dateEnd.classList.add('error');
            dateEnd.focus();
            return { isValid: false };
        }

        // Valida se as datas são válidas
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            showError("Por favor, selecione datas válidas.");
            return { isValid: false };
        }

        // Verifica se a data inicial é anterior ou igual à data final
        if (!validateDateRange(startDate, endDate)) {
            showError("A data inicial deve ser anterior ou igual à data final.");
            dateStart.classList.add('error');
            dateEnd.classList.add('error');
            dateStart.focus();
            return { isValid: false };
        }

        // Retorna dados validados
        return {
            isValid: true,
            data: {
                store,
                dateStart: startDate,
                dateEnd: endDate
            }
        };
    }
    
    // ===== FUNÇÕES DE NAVEGAÇÃO =====
    
    /**
     * Constrói URL com parâmetros para navegação
     * @param {string} startReference - Referência do tipo de relatório
     * @param {Object} data - Dados do formulário
     * @returns {string} - URL completa com parâmetros
     */
    function buildURL(startReference, data) {
        const url = new URL("conferencia.html", window.location.origin);
        url.searchParams.set("startReference", startReference);
        url.searchParams.set("store", data.store);
        url.searchParams.set("dateStart", data.dateStart);
        url.searchParams.set("dateEnd", data.dateEnd);
        return url.toString();
    }

    /**
     * Processa a ação do botão clicado
     * @param {string} startReference - Referência do tipo de relatório
     */
    function handleAction(startReference) {
        // Valida o formulário antes de prosseguir
        const validation = validateForm();
        
        if (!validation.isValid) {
            return;
        }

        // Log dos dados para debug (pode ser removido em produção)
        console.log('Dados selecionados:', {
            startReference,
            ...validation.data
        });

        // Constrói a URL de destino
        const targetURL = buildURL(startReference, validation.data);

        // Exibe mensagem de sucesso
        showSuccess(`Redirecionando para ${startReference.toUpperCase()}...`);

        // Desabilita todos os botões durante o redirecionamento
        actionButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });

        // Navega para a página com os parâmetros após um pequeno delay
        setTimeout(() => {
            window.location.href = targetURL;
        }, 1000);
    }
    
    // ===== EVENT LISTENERS =====
    
    // Adiciona event listener para cada botão de ação
    actionButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            // Previne comportamento padrão
            event.preventDefault();
            
            // Obtém a referência do botão clicado
            const startReference = button.dataset.startReference;
            
            // Chama a função para processar a ação
            handleAction(startReference);
        });
    });

    // Validação em tempo real para data inicial
    dateStart.addEventListener("change", () => {
        if (dateEnd.value && dateStart.value) {
            if (!validateDateRange(dateStart.value, dateEnd.value)) {
                showError("A data inicial deve ser anterior ou igual à data final.");
                dateStart.classList.add('error');
                dateEnd.classList.add('error');
            } else {
                // Remove classes de erro se as datas estiverem corretas
                dateStart.classList.remove('error');
                dateEnd.classList.remove('error');
                clearMessages();
            }
        }
    });

    // Validação em tempo real para data final
    dateEnd.addEventListener("change", () => {
        if (dateStart.value && dateEnd.value) {
            if (!validateDateRange(dateStart.value, dateEnd.value)) {
                showError("A data inicial deve ser anterior ou igual à data final.");
                dateStart.classList.add('error');
                dateEnd.classList.add('error');
            } else {
                // Remove classes de erro se as datas estiverem corretas
                dateStart.classList.remove('error');
                dateEnd.classList.remove('error');
                clearMessages();
            }
        }
    });

    // Remove classes de erro quando o usuário interage com os campos
    storeSelect.addEventListener("change", () => {
        if (storeSelect.value) {
            storeSelect.classList.remove('error');
        }
    });

    dateStart.addEventListener("input", () => {
        dateStart.classList.remove('error');
    });

    dateEnd.addEventListener("input", () => {
        dateEnd.classList.remove('error');
    });
    
    // ===== INICIALIZAÇÃO =====
    
    /**
     * Inicializa valores padrão da página
     */
    function initializeDefaults() {
        // Define a data atual como padrão para os campos de data
        const today = new Date().toISOString().split('T')[0];
        
        // Define valores padrão apenas se os campos estiverem vazios
        if (!dateStart.value) {
            dateStart.value = today;
        }
        
        if (!dateEnd.value) {
            dateEnd.value = today;
        }
    }

    /**
     * Configura atalhos de teclado para melhor usabilidade
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Atalho Ctrl+Enter para submeter com o primeiro botão
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                if (actionButtons.length > 0) {
                    actionButtons[0].click();
                }
            }
            
            // Atalho Escape para limpar mensagens
            if (event.key === 'Escape') {
                clearMessages();
            }
        });
    }

    // Executa inicializações
    initializeDefaults();
    setupKeyboardShortcuts();
    
    // Log de inicialização (pode ser removido em produção)
    console.log('Sistema Código Mil inicializado com sucesso');
});