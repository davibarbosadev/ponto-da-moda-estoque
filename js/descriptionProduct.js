const form = document.querySelector(".form");
const descriptionList = document.querySelector(".description-list");
const btnClean = document.querySelector(".btn-clean");
const btnPrint = document.querySelector(".btn-print");
const iframe = document.querySelector("#iframeContent");

// Recupera a lista de produtos do localStorage ou inicializa uma lista vazia
let productList = JSON.parse(localStorage.getItem("productList")) || [];

// Atualiza o localStorage com a lista de produtos
const updateLocalStorage = () => {
    localStorage.setItem("productList", JSON.stringify(productList));
};

// Limpa os campos do formulário e foca no primeiro campo
const clearForm = () => {
    form.reset();
    form.description.focus();
};

// Renderiza a lista de produtos na tela
const renderProducts = () => {
    descriptionList.innerHTML = productList
        .map(
            (product, index) => `
        <div class="description-card">
            <header class="description-card__header">
                <div class="description-card__title">
                    <span class="description-card__text-content">${product.description || ''}</span>
                </div>

                <div class="description-card__category">
                    <span>${product.fashionStyle || ''}</span>
                </div>
            </header>
            
            <div class="description-card__details">
                <div class="description-card__reference">
                    <span class="description-card__text-label">ref:</span>
                    <span class="description-card__text-content">${product.reference || ''}</span>
                </div>

                <div class="description-card__price">
                    <span class="description-card__text-label">R$:</span>
                    <span class="description-card__text-content">${(product.price || '0')
                        .toString()
                        .replace(".", ",")}</span>
                </div>

                <div class="description-card__sizes">
                    <span class="description-card__text-label">tamanho:</span>
                    <span class="description-card__text-content">${product.sizes || ''}</span>
                </div>

                <div class="description-card__colors">
                    <span class="description-card__text-label">cores:</span>
                    <span class="description-card__text-content">
                        ${product.colors.join(" - ")}
                    </span>
                </div>
            </div>

            <div class="description-card__actions">
                 <button class="btn btn--outline btn--small btn-edit" data-index="${index}">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="btn__icon"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path
                            d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                        />
                        <path d="M16 5l3 3" />
                    </svg>

                    <span>Editar</span>
                </button>

                <button class="btn btn--outline btn--small btn-duplicate" data-index="${index}">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="btn__icon"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />

                    <path
                        d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
                    />

                    <path
                        d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                    />

                    <path d="M11 14h6" />
                    <path d="M14 11v6" />
                </svg>
                <span>Duplicar</span>
                </button>

                <button class="btn btn--outline btn--small btn--danger btn-delete" data-index="${index}">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="btn__icon"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
                <span>Excluir</span>
                </button>
            </div>
        </div>
        </div>
    `
        )
        .join("");
};

// Adiciona um novo produto à lista ao submeter o formulário
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const product = {
        description: form.description.value.toUpperCase(),
        reference: form.reference.value.toUpperCase(),
        fashionStyle: form.fashionStyle.value.toUpperCase(),
        sizes: form.sizes.value.toUpperCase(),
        colors: form.colors.value
            .toUpperCase()
            .split("-")
            .map((item) => item.trim())
            .filter((item) => item.length > 0), // Remove itens vazios
        price: Number(form.price.value),
    };

    productList.unshift(product);
    console.log(productList);
    updateLocalStorage();
    renderProducts();
    clearForm();
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

        // Verifica se o botão clicado é de edição
        if (button.classList.contains("btn-edit")) {
            if (
                form.description.value ||
                form.reference.value ||
                form.sizes.value ||
                form.colors.value ||
                form.price.value
            ) {
                alert("Finalize a edição atual antes de editar outro item.");
                return;
            }
            const product = productList[index];
            form.description.value = product.description;
            form.reference.value = product.reference;
            form.fashionStyle.value = product.fashionStyle;
            form.sizes.value = product.sizes;
            form.colors.value = product.colors.join(" - ");
            form.price.value = product.price;
            productList.splice(index, 1);
        }

        // Verifica se o botão clicado é de duplicação
        if (button.classList.contains("btn-duplicate")) {
            productList.splice(Number(index) + 1, 0, { ...productList[index] });
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
