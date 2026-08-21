export function initDescriptionProductPage() {
    const formAuto = document.querySelector(".form--description-auto");
    const descriptionList = document.querySelector(".description-list");
    const btnClean = document.querySelector(".btn-clean");
    const btnPrint = document.querySelector(".btn-print");

    // Elementos do Modal de Edição
    const modalOverlay = document.querySelector("#modalProduct");
    const modalTitle = document.querySelector("#modalTitle");
    const btnCloseModal = document.querySelector("#btnCloseModal");
    const btnCancelModal = document.querySelector(".btn-cancel-modal");
    const formModal = document.querySelector("#formModalProduct");

    if (!formAuto && !descriptionList) return;

    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    productList = productList.filter(product => product && typeof product === 'object' && product.reference);

    const updateLocalStorage = () => {
        localStorage.setItem("productList", JSON.stringify(productList));
    };

    const API_BASE_URL = 'https://api-ponto-da-moda.onrender.com/api/description';

    const fetchProductByReference = async (reference) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reference/${reference}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            return null;
        }
    };

    const openEditModal = (index) => {
        if (!modalOverlay || index === null || index === undefined) return;
        if (formModal) formModal.reset();

        const product = productList[index];
        if (!product) return;

        const editIndexInput = document.querySelector("#editIndex");

        if (modalTitle) modalTitle.textContent = "Editar Produto";
        if (editIndexInput) editIndexInput.value = index;

        if (formModal.description) formModal.description.value = product.description || '';
        if (formModal.reference) formModal.reference.value = product.reference || '';
        if (formModal.fashionStyle) formModal.fashionStyle.value = product.fashionStyle || '';
        if (formModal.sizes) formModal.sizes.value = product.sizes || '';
        if (formModal.price) formModal.price.value = product.price || '';
        if (formModal.colors) {
            formModal.colors.value = Array.isArray(product.colors)
                ? product.colors.join(" - ")
                : (product.colors || '');
        }

        modalOverlay.classList.add("modal-overlay--active");
        modalOverlay.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            if (formModal && formModal.description) formModal.description.focus();
        }, 100);
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove("modal-overlay--active");
        modalOverlay.setAttribute("aria-hidden", "true");
        if (formModal) formModal.reset();
    };

    const renderProducts = () => {
        if (!descriptionList) return;

        const validProducts = productList.filter(product => product && typeof product === 'object');

        descriptionList.innerHTML = validProducts
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
                        <span class="description-card__text-content">${(product.price || '0').toString().replace(".", ",")}</span>
                    </div>

                    <div class="description-card__sizes">
                        <span class="description-card__text-label">tamanho:</span>
                        <span class="description-card__text-content">${product.sizes || ''}</span>
                    </div>

                    <div class="description-card__colors">
                        <span class="description-card__text-label">cores:</span>
                        <span class="description-card__text-content">
                            ${Array.isArray(product.colors) ? product.colors.join(" - ") : (product.colors || '')}
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
                                <path
                                    d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                                />
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
                                    d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                                />
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
            </div>`
            )
            .join("");

        if (validProducts.length !== productList.length) {
            productList = validProducts;
            updateLocalStorage();
        }
    };

    if (formAuto) {
        formAuto.addEventListener("submit", async (event) => {
            event.preventDefault();

            const referencesField = formAuto.references || formAuto.querySelector('[name="references"]');
            const references = referencesField ? referencesField.value.toUpperCase().trim() : '';

            if (!references) return;

            const submitButton = formAuto.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : '';

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Buscando...";
            }

            try {
                const productFromAPI = await fetchProductByReference(references);

                if (productFromAPI) {
                    productList.unshift({
                        description: productFromAPI.description || '',
                        fashionStyle: productFromAPI.fashionStyle || '',
                        reference: productFromAPI.reference || references,
                        sizes: productFromAPI.sizes || '',
                        colors: productFromAPI.colors || '',
                        price: productFromAPI.price || ''
                    });
                    updateLocalStorage();
                    renderProducts();
                    formAuto.reset();
                } else {
                    alert("Produto não encontrado!");
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            }
        });
    }

    if (formModal) {
        formModal.addEventListener("submit", (event) => {
            event.preventDefault();

            const editIndexInput = document.querySelector("#editIndex");
            const indexValue = editIndexInput ? editIndexInput.value : "";

            if (indexValue !== "" && indexValue !== null) {
                const index = Number(indexValue);
                productList[index] = {
                    description: formModal.description ? formModal.description.value.toUpperCase().trim() : '',
                    reference: formModal.reference ? formModal.reference.value.toUpperCase().trim() : '',
                    fashionStyle: formModal.fashionStyle ? formModal.fashionStyle.value.toUpperCase().trim() : '',
                    sizes: formModal.sizes ? formModal.sizes.value.toUpperCase().trim() : '',
                    colors: formModal.colors
                        ? formModal.colors.value.toUpperCase().split("-").map((i) => i.trim()).filter((i) => i.length > 0)
                        : [],
                    price: formModal.price ? formModal.price.value : '',
                };

                updateLocalStorage();
                renderProducts();
                closeModal();
            }
        });
    }

    if (descriptionList) {
        descriptionList.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) return;

            const index = button.dataset.index;
            if (index === undefined) return;

            if (button.classList.contains("btn-edit")) {
                openEditModal(index);
            } else if (button.classList.contains("btn-duplicate")) {
                productList.splice(Number(index) + 1, 0, JSON.parse(JSON.stringify(productList[index])));
                updateLocalStorage();
                renderProducts();
            } else if (button.classList.contains("btn-delete")) {
                if (confirm("Deseja excluir esse item?")) {
                    productList.splice(index, 1);
                    updateLocalStorage();
                    renderProducts();
                }
            }
        });
    }

    if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener("click", closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (event) => {
            if (event.target === modalOverlay) closeModal();
        });
    }

    if (btnClean) {
        btnClean.addEventListener("click", () => {
            if (confirm("Deseja limpar tudo?")) {
                productList = [];
                updateLocalStorage();
                renderProducts();
            }
        });
    }

    if (btnPrint) {
        btnPrint.addEventListener("click", () => {
            const iframe = document.querySelector("#iframeContent");
            if (iframe) iframe.src = `/print.html?t=${Date.now()}`;
        });
    }

    renderProducts();
}