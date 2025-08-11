const formDescriptionAuto = document.querySelector(".form--description-auto");
const descriptionList = document.querySelector(".description-list");
const btnClean = document.querySelector(".btn--clean");
const btnPrint = document.querySelector(".btn--print");
const iframe = document.querySelector("#iframeContent");

// Recupera a lista de produtos do localStorage ou inicializa uma lista vazia
let productList = JSON.parse(localStorage.getItem("productList")) || [];

// Limpa produtos inválidos do localStorage na inicialização
productList = productList.filter(product => product && typeof product === 'object' && product.reference);

// Atualiza o localStorage se foram removidos produtos inválidos
if (productList.length !== (JSON.parse(localStorage.getItem("productList")) || []).length) {
    localStorage.setItem("productList", JSON.stringify(productList));
}

// Atualiza o localStorage com a lista de produtos
const updateLocalStorage = () => {
    localStorage.setItem("productList", JSON.stringify(productList));
};

// Limpa os campos do formulário e foca no primeiro campo
const clearForm = () => {
    formDescriptionAuto.reset();
    const referencesField = formDescriptionAuto.references || formDescriptionAuto.querySelector('[name="references"]');
    if (referencesField) {
        referencesField.focus();
    }
};

// Configuração da URL base da API
const API_BASE_URL = 'https://api-ponto-da-moda.onrender.com/api/description'; // Ajuste para a porta da sua API

// Função para buscar produto por referência na API
const fetchProductByReference = async (reference) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reference/${reference}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        // Verifica se a resposta é válida
        if (!response.ok) {
            if (response.status === 404) {
                console.log("Produto não encontrado na API");
                return null;
            }
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log("Produto encontrado na API:", result.data);
            return result.data;
        } else {
            console.log("Produto não encontrado:", result.message);
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        // Se for erro de conexão ou API não disponível, retorna null
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            console.log("API não disponível, usando dados do formulário");
        }
        return null;
    }
};

// Renderiza a lista de produtos na tela
const renderProducts = () => {
    // Filtra produtos válidos para evitar erros
    const validProducts = productList.filter(product => product && typeof product === 'object');
    
    descriptionList.innerHTML = validProducts
        .map(
            (product, index) => `
        <div class="description product">
            <div class="header-component">
                <div class="product__description">
                    <span class="description__text-content">${product.description || ''}</span>
                </div>
                <div class="product__fashion-style">
                    <span class="description__text-content">${product.fashionStyle || ''}</span>
                </div>
            </div>
            
            <div class="product__reference">
                <span class="description__text-title">Ref:</span>
                <span class="description__text-content">${product.reference || ''}</span>
            </div>

            <div class="product__sizes">
                <span class="description__text-title">Tamanho:</span>
                <span class="description__text-content">${product.sizes || ''}</span>
            </div>

            <div class="product__color">
                <span class="description__text-title">Cores:</span>
                <span class="description__text-content">
                    ${product.colors
                        .map(
                            (color) => `
                            <span class="color-box ${color}" title="${color}"></span>
                        `
                        )
                    .join("")}
                </span>
            </div>


            <div class="product__price">
                <span class="description__text-title">R$:</span>
                <span class="description__text-content">${(product.price || '0')
                    .toString()
                    .replace(".", ",")}</span>
            </div>

            <div class="btns__options">
                <button class="btn--icons btn-duplicate" data-index="${index}">
                    <ion-icon name="duplicate-outline"></ion-icon>
                </button>

                <button class="btn--icons btn-delete" data-index="${index}">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
        </div>
    `
        )
        .join("");
        
    // Atualiza o productList para conter apenas produtos válidos
    if (validProducts.length !== productList.length) {
        productList = validProducts;
        updateLocalStorage();
    }
};

// Adiciona um novo produto à lista ao submeter o formulário
formDescriptionAuto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const referencesField = formDescriptionAuto.references || formDescriptionAuto.querySelector('[name="references"]');
    const references = referencesField ? referencesField.value.toUpperCase().trim() : '';
    
    if (!references) {
        alert("Por favor, insira uma referência válida");
        return;
    }

    // Mostra indicador de carregamento
    const submitButton = formDescriptionAuto.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
        submitButton.textContent = 'Buscando...';
        submitButton.disabled = true;
    }

    // Busca o produto na API pela referência
    const productFromAPI = await fetchProductByReference(references);
    
    // Restaura o botão
    if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
    
    if (productFromAPI) {
        // Se encontrou o produto na API, cria o produto com os dados da API
        const product = {
            description: productFromAPI.description || '',
            fashionStyle: productFromAPI.fashionStyle || '',
            reference: productFromAPI.reference || references,
            sizes: productFromAPI.sizes || '',
            colors: productFromAPI.colors || '',
            price: productFromAPI.price || ''
        };
        
        console.log("Produto encontrado na API:", product);
        
        // Adiciona o produto à lista
        productList.unshift(product);
        updateLocalStorage();
        renderProducts();
        clearForm();
    } else {
        // Se não encontrou na API, mostra mensagem e não adiciona nada
        alert("Produto não encontrado! Verifique se a referência está correta.");
        console.log("Produto não encontrado na API para a referência:", references);
    }
});

// Manipula eventos de edição, duplicação e exclusão de produtos
descriptionList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const index = button.dataset.index;
    if (index === undefined) return;

    // Adiciona efeito de clique e vibração
    button.classList.add("pressed");
    if (navigator.vibrate) navigator.vibrate(50); // Vibração de 50ms

    // Aguarda 150ms antes de executar as ações principais
    setTimeout(() => {
        button.classList.remove("pressed");

        // Verifica se o botão clicado é de duplicação
        if (button.classList.contains("btn-duplicate")) {
            const productToDuplicate = productList[index];
            if (productToDuplicate) {
                productList.splice(Number(index) + 1, 0, { ...productToDuplicate });
            }
        }

        // Verifica se o botão clicado é de exclusão
        if (button.classList.contains("btn-delete")) {
            if (confirm("Deseja excluir esse item?")) {
                productList.splice(index, 1);
            }
        }

        updateLocalStorage();
        renderProducts();
    }, 100); // Pequeno atraso para exibir o efeito antes da re-renderização
});

// Limpa toda a lista de produtos com confirmação
btnClean.addEventListener("click", () => {
    if (confirm("Deseja limpar tudo?")) {
        productList = [];
        updateLocalStorage();
        renderProducts();
    }
});

// Gera um PDF com a lista de produtos ao clicar no botão de impressão
btnPrint.addEventListener("click", () => {
    iframe.src = "print.html";
    iframe.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(iframe.contentWindow.document.body.innerHTML, 10, 10);
    };
});

// Renderiza os produtos ao carregar a página
renderProducts();