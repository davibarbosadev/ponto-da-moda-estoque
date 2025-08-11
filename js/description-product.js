const form = document.querySelector(".form");
const descriptionList = document.querySelector(".description-list");
const btnClean = document.querySelector(".btn--clean");
const btnPrint = document.querySelector(".btn--print");
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
        <div class="description product">
            <div class="header-component">
                <div class="product__description">
                    <span class="description__text-content">${product.description}</span>
                </div>
                <div class="product__fashion-style">
                    <span class="description__text-content">${product.fashionStyle}</span>
                </div>
            </div>
            
            <div class="product__reference">
                <span class="description__text-title">Ref:</span>
                <span class="description__text-content">${product.reference}</span>
            </div>

            <div class="product__sizes">
                <span class="description__text-title">Tamanho:</span>
                <span class="description__text-content">${product.sizes}</span>
            </div>

            <div class="product__color">
                <span class="description__text-title">Cores:</span>
                <span class="description__text-content">
                    ${product.colors.join(" - ")}
                </span>
            </div>

            <div class="product__price">
                <span class="description__text-title">R$:</span>
                <span class="description__text-content">${product.price
                    .toString()
                    .replace(".", ",")}</span>
            </div>

            <div class="btns__options">
                <button class="btn--icons btn-edit" data-index="${index}">
                    <ion-icon name="pencil-outline"></ion-icon>
                </button>
                 
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
