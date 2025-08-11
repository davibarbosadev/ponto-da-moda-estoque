class ProductManager {
    constructor() {
        this.productStates = {};
        this.currentProducts = [];
        this.filteredProducts = []; // Array para produtos filtrados
        this.currentFilter = ""; // Filtro atual
        this.productsListContainer = document.getElementById("products-list");
        this.progressBar = document.getElementById("progress-bar");
        this.progressText = document.getElementById("progress-text");
        this.filterInput = document.getElementById("filter-input");
        this.correctPassword = "1234"; // Senha para modificações
        // isAuthenticated will be managed per action, not a global long-lived state
        this.isAuthenticated = false;

        // Bind event handlers
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.init();
        this.setupFilterInput();
        this.createPasswordModal();
    }

    createPasswordModal() {
        if (!document.getElementById("password-modal")) {
            const modalHTML = `
                <div id="password-modal" class="password-modal" style="display: none;">
                    <div class="password-modal-content">
                        <div class="password-modal-header">
                            <h3>Senha Necessária</h3>
                            <p>Digite a senha para modificar produtos já conferidos:</p>
                        </div>
                        <div class="password-modal-body">
                            <input type="password" id="password-input" placeholder="Digite a senha..." maxlength="4">
                            <div id="password-error" class="password-error" style="display: none;">
                                Senha incorreta. Tente novamente.
                            </div>
                        </div>
                        <div class="password-modal-footer">
                            <button id="password-confirm-btn" class="password-btn confirm">Confirmar</button>
                            <button id="password-cancel-btn" class="password-btn cancel">Cancelar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", modalHTML);
            this.setupPasswordModal();
        }
    }

    setupPasswordModal() {
        const modal = document.getElementById("password-modal");
        const passwordInput = document.getElementById("password-input");
        const confirmBtn = document.getElementById("password-confirm-btn");
        const cancelBtn = document.getElementById("password-cancel-btn");
        const errorDiv = document.getElementById("password-error");

        let resolveAuthentication = null; // Will store the resolve function of the Promise
        let rejectAuthentication = null; // Will store the reject function of the Promise

        this.authenticate = () => {
            return new Promise((resolve, reject) => {
                resolveAuthentication = resolve;
                rejectAuthentication = reject;
                modal.style.display = "flex";
                passwordInput.value = "";
                passwordInput.focus();
                errorDiv.style.display = "none";
            });
        };

        const hideModal = (isAuthenticated = false) => {
            modal.style.display = "none";
            passwordInput.value = "";
            errorDiv.style.display = "none";
            // Reset isAuthenticated immediately after modal closes
            this.isAuthenticated = isAuthenticated;
        };

        const checkPassword = () => {
            const enteredPassword = passwordInput.value.trim();
            if (enteredPassword === this.correctPassword) {
                hideModal(true); // Indicate successful authentication
                if (resolveAuthentication) {
                    resolveAuthentication(true);
                }
            } else {
                errorDiv.style.display = "block";
                passwordInput.value = "";
                passwordInput.focus();
                if (rejectAuthentication) {
                    rejectAuthentication(new Error("Incorrect password"));
                }
            }
        };

        confirmBtn.addEventListener("click", checkPassword);
        cancelBtn.addEventListener("click", () => {
            hideModal(false); // Indicate authentication cancelled
            if (rejectAuthentication) {
                rejectAuthentication(new Error("Authentication cancelled"));
            }
        });

        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                checkPassword();
            } else if (e.key === "Escape") {
                hideModal(false);
                if (rejectAuthentication) {
                    rejectAuthentication(new Error("Authentication cancelled"));
                }
            }
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hideModal(false);
                if (rejectAuthentication) {
                    rejectAuthentication(new Error("Authentication cancelled"));
                }
            }
        });
    }

    setupFilterInput() {
        if (this.filterInput) {
            this.filterInput.addEventListener("input", (e) => {
                this.handleFilterChange(e.target.value);
            });
            this.filterInput.placeholder = "Buscar por referência...";
        }
    }

    handleFilterChange(filterValue) {
        this.currentFilter = filterValue.toLowerCase().trim();
        this.applyFilter();
        this.renderProducts();
        this.updateProgressBar();
    }

    applyFilter() {
        if (!this.currentFilter) {
            this.filteredProducts = [...this.currentProducts];
        } else {
            this.filteredProducts = this.currentProducts.filter((product) => {
                const reference = (product.reference || "").toLowerCase();
                // const description = (product.description || "").toLowerCase();
                return reference.includes(this.currentFilter) /* ||
                    description.includes(this.currentFilter) */;
            });
        }
    }

    async init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.loadProducts());
        } else {
            await this.loadProducts();
        }
    }

    async loadProducts() {
        const params = new URLSearchParams(window.location.search);
        const startReference = params.get("startReference");
        const store = params.get("store");
        const dateStart = params.get("dateStart");
        const dateEnd = params.get("dateEnd");

        try {
            // Cria a URL com os parâmetros necessários
            const url = new URL("https://api-ponto-da-moda.onrender.com/api/products");
            if (startReference) url.searchParams.append("startReference", startReference);
            if (store) url.searchParams.append("store", store);
            if (dateStart) url.searchParams.append("dateStart", dateStart);
            if (dateEnd) url.searchParams.append("dateEnd", dateEnd);

            // Requisição dos produtos
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

            // Conversão da resposta em JSON
            const products = await response.json();

            // Verifica se retornou algum produto
            if (products.length === 0) {
                this.showNoProductsMessage();
                this.updateProgressBar();
                return;
            }

            // ORDENA OS PRODUTOS PELA REFERÊNCIA ANTES DE CONTINUAR
            products.sort((a, b) => {
                const refA = (a.reference || "").toUpperCase();
                const refB = (b.reference || "").toUpperCase();
                return refA.localeCompare(refB);
            });

            // Define os produtos como atuais e inicia os estados
            this.currentProducts = products;
            this.initializeProductStates(products);

            // Aplica filtro, renderiza e atualiza progresso
            this.applyFilter();
            this.renderProducts();
            this.updateProgressBar();
            this.updateStoreInfo();
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
            this.showErrorMessage("Erro ao carregar produtos. Tente novamente.");
            this.updateProgressBar();
        }
    }

    initializeProductStates(products) {
        this.productStates = {};
        products.forEach((product) => {
            console.log(product.store);
            this.productStates[product._id] = {
                status: product.status || "not-checked",
                actualQuantity: product.divergence || 0,
            };
        });
    }

    updateProgressBar() {
        const stats = this.getStats();
        const checkedProducts = stats.confirmed + stats.notReceived + stats.divergent;
        const totalProducts = stats.total;

        const percentage = totalProducts > 0 ? (checkedProducts / totalProducts) * 100 : 0;

        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
            this.progressBar.className = "progress-bar"; // Reset classes
            if (percentage === 100) {
                this.progressBar.classList.add("complete");
            } else if (percentage > 0) {
                this.progressBar.classList.add("in-progress");
            }
        }

        if (this.progressText) {
            const filteredCount = this.filteredProducts.length;
            let progressText = `Conferidos: ${checkedProducts} de ${totalProducts} `;

            if (this.currentFilter && filteredCount < totalProducts) {
                progressText += ` (${filteredCount} exibidos)`;
            }
            this.progressText.textContent = progressText;
        }
    }

    getStatusText(status) {
        const statusMap = {
            confirmed: "Conferido",
            "not-received": "Não Recebido",
            divergent: "Divergência",
            "not-checked": "Não Conferido",
        };
        return statusMap[status] || "Não Conferido";
    }

    async updateProductInDatabase(productId, updates) {
        try {
            const response = await fetch(
                `https://api-ponto-da-moda.onrender.com/api/products/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updates),
                }
            );

            if (!response.ok) {
                throw new Error(`Erro ao atualizar produto: ${response.status}`);
            }

            const updatedProduct = await response.json();
            console.log("Produto atualizado com sucesso:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error("Erro ao atualizar produto no banco:", error);
            this.showErrorMessage("Erro ao salvar alterações. Tente novamente.");
            throw error;
        }
    }

    requiresAuthentication(productId) {
        const currentState = this.productStates[productId];
        if (!currentState) return false;
        return currentState.status !== "not-checked";
    }

    async handleStatusChange(productId, newStatus) {
        console.log(`Tentando alterar status do produto ${productId} para ${newStatus}`);

        if (this.requiresAuthentication(productId) && !this.isAuthenticated) {
            try {
                await this.authenticate(); // Wait for authentication
                // If authentication is successful, isAuthenticated is set to true by setupPasswordModal
            } catch (error) {
                console.log("Authentication failed or cancelled:", error.message);
                this.isAuthenticated = false; // Ensure it's false on failure/cancel
                return; // Stop execution if not authenticated
            }
        }
        // Now isAuthenticated is true (if required and successful), or not needed.
        await this.executeStatusChange(productId, newStatus);
        this.isAuthenticated = false; // Reset authentication after action completion
    }

    async executeStatusChange(productId, newStatus) {
        if (!this.productStates[productId]) {
            console.error("Estado do produto não encontrado para o ID:", productId);
            return;
        }

        const currentProduct = this.currentProducts.find((p) => p._id === productId);
        if (!currentProduct) {
            console.error("Produto não encontrado:", productId);
            return;
        }

        if (newStatus === "divergent") {
            this.productStates[productId].status = newStatus;
            if (this.productStates[productId].actualQuantity <= 0) {
                this.productStates[productId].actualQuantity = currentProduct.quantity;
            }
            this.applyFilter();
            this.renderProducts();
            return;
        }

        const updates = {
            status: newStatus,
            divergence: 0,
        };

        this.productStates[productId].actualQuantity = 0; // Reset quantity on OK or Not Received

        try {
            await this.updateProductInDatabase(productId, updates);

            this.productStates[productId].status = newStatus;
            const productIndex = this.currentProducts.findIndex((p) => p._id === productId);
            if (productIndex !== -1) {
                this.currentProducts[productIndex].status = newStatus;
                this.currentProducts[productIndex].divergence = 0;
            }

            this.applyFilter();
            this.renderProducts();
            this.updateProgressBar();
        } catch (error) {
            console.error("Falha ao atualizar status do produto:", error);
        }
    }

    async handleQuantityChange(productId, newQuantity) {
        console.log(`Tentando alterar quantidade do produto ${productId} para ${newQuantity}`);

        if (this.requiresAuthentication(productId) && !this.isAuthenticated) {
            try {
                await this.authenticate(); // Wait for authentication
            } catch (error) {
                console.log("Authentication failed or cancelled:", error.message);
                this.isAuthenticated = false;
                // Revert input value if authentication failed/cancelled
                const inputElement = document.querySelector(`input[onchange*="${productId}"]`);
                if (inputElement) {
                    inputElement.value = this.productStates[productId].actualQuantity;
                }
                return;
            }
        }
        await this.executeQuantityChange(productId, newQuantity);
        this.isAuthenticated = false; // Reset authentication after action completion
    }

    async executeQuantityChange(productId, newQuantity) {
        if (!this.productStates[productId]) {
            console.error("Estado do produto não encontrado para o ID:", productId);
            return;
        }

        const quantity = parseInt(newQuantity) || 0;

        const currentProduct = this.currentProducts.find((p) => p._id === productId);
        if (!currentProduct) {
            console.error("Produto não encontrado:", productId);
            return;
        }

        let newStatus;
        if (quantity === 0) {
            alert(
                'Quantidade não pode ser 0 para divergência. O status será alterado para "Não Recebido".'
            );
            newStatus = "not-received";
        } else if (quantity !== currentProduct.quantity) {
            newStatus = "divergent";
        } else {
            newStatus = "confirmed";
        }

        try {
            const updates = {
                divergence: quantity,
                status: newStatus,
            };

            await this.updateProductInDatabase(productId, updates);

            this.productStates[productId].actualQuantity = quantity;
            this.productStates[productId].status = newStatus;

            const productIndex = this.currentProducts.findIndex((p) => p._id === productId);
            if (productIndex !== -1) {
                this.currentProducts[productIndex].divergence = quantity;
                this.currentProducts[productIndex].status = newStatus;
            }

            this.applyFilter();
            this.renderProducts();
            this.updateProgressBar();
        } catch (error) {
            console.error("Falha ao atualizar quantidade do produto:", error);
        }
    }

    showNoProductsMessage() {
        if (this.productsListContainer) {
            const message = this.currentFilter
                ? "Nenhum produto encontrado para o filtro aplicado."
                : "Nenhum produto encontrado.";

            this.productsListContainer.innerHTML = `
                <div class="no-products-message">
                    <p>${message}</p>
                    ${
                        this.currentFilter
                            ? `
                        <button onclick="productManager.clearFilter()" class="clear-filter-btn">
                            Limpar filtro
                        </button>
                    `
                            : ""
                    }
                </div>
            `;
        }
    }

    showErrorMessage(message) {
        if (this.productsListContainer) {
            this.productsListContainer.innerHTML = `
                <div class="error-message">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    renderProducts() {
        if (!this.productsListContainer) {
            console.error("Container 'products-list' não encontrado");
            return;
        }

        if (this.filteredProducts.length === 0) {
            this.showNoProductsMessage();
            return;
        }

        this.productsListContainer.innerHTML = "";

        this.filteredProducts.forEach((product) => {
            const state = this.productStates[product._id];

            if (!state) {
                console.error("Estado não encontrado para o produto:", product._id);
                return;
            }

            const productCard = this.createProductCard(product, state);
            this.productsListContainer.appendChild(productCard);
        });
    }

    createProductCard(product, state) {
        const statusText = this.getStatusText(state.status);

        const productCard = document.createElement("div");
        productCard.className = `product-card ${state.status}`;

        const highlightedReference = this.highlightFilterText(product.reference);
        const highlightedDescription = this.highlightFilterText(product.description);

        productCard.innerHTML = `
            <div class="product-header">
                <div class="product-reference">
                    ${highlightedReference}
                </div>
                <div>
                    <span class="status-badge ${state.status}">
                        ${statusText}
                    </span>
                </div>
            </div>

            <div class="product-description">
                <div>${highlightedDescription}</div>
            </div>

            <div class="expected-quantity">
                <span class="label">Qtd. Esperada: </span>
                <span class="value">${product.quantity}</span>
            </div>

            ${this.renderQuantityInput(product, state)}

            <div class="action-buttons">
                ${this.renderActionButtons(product, state)}
            </div>
        `;

        return productCard;
    }

    highlightFilterText(text) {
        if (!this.currentFilter || !text) {
            return this.escapeHtml(text);
        }

        const escapedText = this.escapeHtml(text);
        const regex = new RegExp(`(${this.escapeRegex(this.currentFilter)})`, "gi");

        return escapedText.replace(regex, "<mark>$1</mark>");
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    renderQuantityInput(product, state) {
        if (state.status !== "divergent") return "";

        const difference = state.actualQuantity - product.quantity;
        const showDifference = state.actualQuantity !== product.quantity; // Show if different, not just > 0

        return `
            <div class="quantity-input-section">
                <div class="quantity-input-row">
                    <label>Qtd. Recebida:</label>
                    <input
                        type="number"
                        min="0"
                        value="${state.actualQuantity || 0}"
                        onchange="productManager.handleQuantityChange('${product._id}', this.value)"
                        placeholder="0"
                    />
                </div>
                ${
                    showDifference
                        ? `
                    <div class="quantity-difference">
                        <strong>Diferença:</strong> 
                        <span class="${difference >= 0 ? "positive" : "negative"}">
                            ${difference > 0 ? "+" : ""}${difference}
                        </span>
                    </div>
                `
                        : ""
                }
            </div>
        `;
    }

    renderActionButtons(product, state) {
        const buttons = [
            {
                status: "confirmed",
                icon: "ph-check",
                text: "OK",
                activeClass: "ok-active",
                inactiveClass: "ok-inactive",
            },
            {
                status: "not-received",
                icon: "ph-x",
                text: "Faltou",
                activeClass: "falta-active",
                inactiveClass: "falta-inactive",
            },
            {
                status: "divergent",
                icon: "ph-warning",
                text: "Diverg.",
                activeClass: "diverg-active",
                inactiveClass: "diverg-inactive",
            },
        ];

        return buttons
            .map(
                (button) => `
            <button
                onclick="productManager.handleStatusChange('${product._id}', '${button.status}')"
                class="action-button ${
                    state.status === button.status ? button.activeClass : button.inactiveClass
                }"
            >
                <i class="ph ${button.icon}"></i>
                ${button.text}
            </button>
        `
            )
            .join("");
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    getStats() {
        const stats = {
            confirmed: 0,
            notReceived: 0,
            divergent: 0,
            notChecked: 0,
            total: this.currentProducts.length,
        };

        Object.values(this.productStates).forEach((state) => {
            switch (state.status) {
                case "confirmed":
                    stats.confirmed++;
                    break;
                case "not-received":
                    stats.notReceived++;
                    break;
                case "divergent":
                    stats.divergent++;
                    break;
                default:
                    stats.notChecked++;
                    break;
            }
        });

        return stats;
    }

    clearFilter() {
        if (this.filterInput) {
            this.filterInput.value = "";
        }
        this.handleFilterChange("");
    }

    setFilter(filterValue) {
        if (this.filterInput) {
            this.filterInput.value = filterValue;
        }
        this.handleFilterChange(filterValue);
    }

    refreshProgressBar() {
        this.updateProgressBar();
    }

    logout() {
        this.isAuthenticated = false;
        console.log("Autenticação removida");
    }

    updateStoreInfo() {
        const storeInfoElement = document.getElementById("store-info");

        if (this.currentProducts.length > 0 && storeInfoElement) {
            // Pega a loja do primeiro produto (assumindo que todos são da mesma loja)
            const storeCode = this.currentProducts[0].store;
            // Extrai apenas os números da string (ex: "LE01" -> "01")
            const storeNumber = storeCode.match(/\d+/)[0];
            storeInfoElement.textContent = `Loja: ${storeNumber}`;
        }
    }
}

const productManager = new ProductManager();
