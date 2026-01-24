/**
 * Processador de formatação de produtos para banco de dados
 * Processa dados CSV de produtos e envia para o banco
 */
class ProductProcessor {

    static SIZE_PATTERNS_REGEX = [
        // ========== Padrões com LETRAS ==========

        // Letras + AO + Letras: P AO GG, P AO XGG, P AO EXG, etc
        /((?:PP?|E?X?G{1,2})\s+AO\s+(?:PP?|E?X?G{1,2}))(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/i,

        // Letras + A + Letras: P A GG, P A XGG, P A EXG, etc
        /((?:PP?|E?X?G{1,2})\s+A\s+(?:PP?|E?X?G{1,2}))(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/i,

        // ========== Padrões com G+NÚMERO ==========

        // G+número + AO + G+número: G1 AO G2, G1 AO G3
        /(G\d\s+AO\s+G\d)(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/i,

        // G+número + A + G+número: G1 A G2, G1 A G3
        /(G\d\s+A\s+G\d)(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/i,

        // ========== Padrões NUMÉRICOS ==========

        // Números + AO + Números: 1 AO 3, 4 AO 16, 36 AO 52, etc
        /(\d{1,2}\s+AO\s+\d{1,2})(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/,

        // Números + A + Números: 1 A 3, 4 A 16, 36 A 52, etc
        /(\d{1,2}\s+A\s+\d{1,2})(?=\s|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇÑ]|$)/,
    ];

    static SIZES = ["P", "M", "GG", "G", "XGG", "EXG"];

    static COLOR_WORDS = [
        "CAFE",
        "CAFÉ",
        "BEGE",
        "AZUL",
        "MARINHO",
        "ROSA",
        "VERMELHO",
        "PRETO",
        "BRANCO",
        "AMARELO",
        "VERDE",
        "LILÁS",
        "CINZA",
        "VINHO",
        "OFF",
        "LARANJA",
        "ROXO",
        "NUDE",
        "MARROM",
        "AREIA",
        "SPLASH",
        "BEGONIA",
        "ALUMINIO",
        "LAGO",
        "CEREJA",
        "SPLASH",
    ];

    static UNIT_PATTERNS = /\s?\((un|pç|pc|cj|par)\)/i;
    static SORTED_CODE = "SORTIDO";
    static SORTED_REFERENCE_CODE = "SO1";
    static DEFAULT_SIZE = "ÚNICO";

    constructor(apiBaseUrl = "/api/description") {
        this.apiBaseUrl = apiBaseUrl;
        this.currentProduct = this.#createEmptyProduct();
        this.processingResults = [];
        this.#initializeForm();
        this.#createMessageElement();
    }

    /**
     * Cria o elemento de mensagem se não existir
     * @private
     */
    #createMessageElement() {
        if (!document.querySelector(".message-display")) {
            const messageElement = document.createElement("div");
            messageElement.className = "message-display";

            Object.assign(messageElement.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "12px 20px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "500",
                zIndex: "9999",
                maxWidth: "400px",
                opacity: "0",
                transform: "translateX(100%)",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            });

            const style = document.createElement("style");
            style.textContent = `
                .message-display.open {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(messageElement);
        }
    }

    /**
     * Exibe mensagem para o usuário
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da mensagem (success, error, warning, info)
     */
    showMessage(message, type = "info") {
        let messageElement = document.querySelector(".message-display");

        if (!messageElement) {
            this.#createMessageElement();
            messageElement = document.querySelector(".message-display");
        }

        const styles = {
            success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
            error: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
            warning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" },
            info: { backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" },
        };

        const style = styles[type] || styles.info;
        Object.assign(messageElement.style, style);

        messageElement.textContent = message;
        messageElement.classList.add("open");

        setTimeout(() => {
            messageElement.classList.remove("open");
        }, 3000);
    }

    /**
     * Inicializa o formulário e adiciona event listeners
     * @private
     */
    #initializeForm() {
        const form = document.querySelector(".form--formate-product-description");
        if (!form) {
            console.error("Formulário não encontrado");
            this.showMessage("Erro: Formulário não encontrado", "error");
            return;
        }

        form.addEventListener("submit", this.#handleFormSubmit.bind(this));
    }

    /**
     * Manipula o submit do formulário
     * @private
     */
    async #handleFormSubmit(event) {
        event.preventDefault();

        try {
            const csvData = event.target.csvInput?.value?.trim();

            if (!csvData) {
                this.showMessage("Por favor, insira os dados CSV", "warning");
                return;
            }

            const products = this.#parseCSVData(csvData);

            if (products.length === 0) {
                this.showMessage("Nenhum produto válido encontrado nos dados CSV", "warning");
                return;
            }

            this.showMessage("Processando produtos...", "info");

            const { results, errors } = await this.#processProducts(products);

            // Limpa o textarea após processamento
            event.target.csvInput.value = "";

            // Exibe resultado detalhado
            if (errors.length > 0) {
                const errorDetails = errors
                    .map((err) => `Produto ${err.index}: ${err.error}`)
                    .join("\n");

                console.error("Erros detalhados durante processamento:", errorDetails);

                this.showMessage(
                    `${results.length} produto(s) salvos, ${errors.length} erro(s). Verifique o console para detalhes.`,
                    "warning",
                );
            } else {
                this.showMessage(`✓ ${results.length} produto(s) salvos no banco!`, "success");
            }
        } catch (error) {
            console.error("Erro ao processar produtos:", error.message);
            this.showMessage(`Erro ao processar produtos: ${error.message}`, "error");
        }
    }

    /**
     * Faz parse dos dados CSV
     * @private
     */
    #parseCSVData(csvString) {
        const lines = csvString.trim().split("\n");

        return lines
            .map((line, index) => this.#parseCSVLine(line, index))
            .filter((product) => product !== null);
    }

    /**
     * Faz parse de uma linha CSV
     * @private
     */
    #parseCSVLine(line, index) {
        try {
            const columns = line.split(";").map((col) => col.replace(/"/g, "").trim());

            if (columns.length < 3) {
                throw new Error(`Formato inválido - esperado pelo menos 3 colunas`);
            }

            const { reference, description } = this.#parseSecondColumn(columns[1]);
            const fashionStyle = this.#extractFashionStyle(columns[0], reference);
            const price = this.parsePrice(columns[2]);

            // Validação básica
            if (!fashionStyle || !reference || !description || !price) {
                throw new Error(`Dados incompletos na linha ${index + 1}`);
            }

            return { fashionStyle, reference, description, price };
        } catch (error) {
            console.error(`Erro na linha ${index + 1}:`, error.message);
            return null;
        }
    }

    /**
     * Faz parse da segunda coluna (referência - descrição)
     * @private
     */
    #parseSecondColumn(secondColumn) {
        const parts = secondColumn.split(" - ");
        if (parts.length < 2) {
            throw new Error("Formato inválido - esperado 'referencia - descrição'");
        }

        let [reference, rawDescription] = parts.map((s) => s.trim());

        if (!reference || !rawDescription) {
            throw new Error("Referência ou descrição vazia");
        }

        rawDescription = this.#removeLeadingNumbers(rawDescription);
        const description = rawDescription.replace(ProductProcessor.UNIT_PATTERNS, "").trim();

        return { reference, description };
    }

    /**
     * Envia produto para o banco de dados
     * @param {Object} productData - Dados do produto
     * @returns {Promise<Object>} Produto salvo
     * @private
     */
    async #saveProductToDatabase(productData) {
        try {
            console.log("Dados do produto a ser enviado:", JSON.stringify(productData, null, 2));

            const response = await fetch(this.apiBaseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(productData),
            });

            console.log("Status da resposta:", response.status);

            const responseData = await response.json();
            console.log("Resposta da API:", responseData);

            if (!response.ok) {
                let errorMessage = responseData.message || `Erro HTTP: ${response.status}`;

                if (
                    responseData.errors &&
                    Array.isArray(responseData.errors) &&
                    responseData.errors.length > 0
                ) {
                    const specificErrors = responseData.errors
                        .map((error) => {
                            if (typeof error === "string") {
                                return error;
                            } else if (error.message) {
                                return error.message;
                            } else if (error.field && error.error) {
                                return `${error.field}: ${error.error}`;
                            } else {
                                return JSON.stringify(error);
                            }
                        })
                        .join("; ");

                    errorMessage += ` - Detalhes: ${specificErrors}`;
                }

                console.error("Erro detalhado da API:", errorMessage);
                throw new Error(errorMessage);
            }

            return responseData;
        } catch (error) {
            console.error("Erro ao salvar produto no banco:", error);
            throw error;
        }
    }

    /**
     * Cria um produto vazio com estrutura padrão
     * @private
     */
    #createEmptyProduct() {
        return {
            fashionStyle: "",
            description: "",
            reference: "",
            sizes: "",
            colors: [],
            price: 0,
        };
    }

    /**
     * Valida dados do produto antes de salvar
     * @param {Object} productData - Dados do produto
     * @returns {Object} Produto validado
     * @private
     */

    #validateProductData(productData) {
        console.log("DEBUG: validateProductData - entrada:", productData);

        const validated = {
            fashionStyle: (productData.fashionStyle || "").toString().trim(),
            description: (productData.description || "").toString().trim(),
            reference: (productData.reference || "").toString().trim(),
            sizes: (productData.sizes || ProductProcessor.DEFAULT_SIZE).toString().trim(),
            colors: Array.isArray(productData.colors)
                ? productData.colors
                : productData.colors === ProductProcessor.SORTED_CODE
                  ? ProductProcessor.SORTED_CODE
                  : [],
            price: productData.price,
        };

        console.log("DEBUG: validateProductData - saída:", validated);

        // Validações
        const errors = [];
        if (!validated.fashionStyle) errors.push("Fashion style é obrigatório");
        if (!validated.description) errors.push("Descrição é obrigatória");
        if (!validated.reference) errors.push("Referência é obrigatória");
        if (!validated.price || validated.price <= 0) errors.push("Preço deve ser maior que zero");

        if (errors.length > 0) {
            throw new Error(`Erros de validação: ${errors.join("; ")}`);
        }

        return validated;
    }

    /**
     * Extrai o fashionStyle do produto a partir da estrutura hierárquica
     * @param {string} sectionPath - Caminho da seção
     * @returns {string} FashionStyle formatado
     * @private
     */
    #extractFashionStyle(sectionPath, reference) {
        if (!this.#isValidSectionPath(sectionPath)) {
            return "";
        }

        const normalizedPath = sectionPath.toUpperCase();

        // Verificar padrões específicos (prioridade)
        const specificPattern = this.#extractSpecificPattern(normalizedPath);
        if (specificPattern) {
            return this.#normalizeStyleName(specificPattern);
        }

        // Lógica padrão com hífens
        const hyphenPositions = this.#findHyphenPositions(normalizedPath);
        const isCIReference = this.#isCIReference(reference);

        const requiredHyphens = isCIReference ? 4 : 3;
        if (hyphenPositions.length < requiredHyphens) {
            return "";
        }

        const extractedStyle = this.#extractStyleSegment(
            normalizedPath,
            hyphenPositions,
            isCIReference,
        );

        return this.#normalizeStyleName(extractedStyle);
    }

    #extractSpecificPattern(normalizedPath) {
        // Lista de padrões específicos para buscar
        // Adicione novos padrões aqui conforme necessário
        const specificPatterns = [
            "MODA SONHO",
            "PET",
            "ACESSORIOS",
            // Adicione mais padrões aqui no futuro:
            // "PLUS SIZE",
            // "GESTANTE",
            // "PRAIA",
        ];

        // Verifica se algum padrão específico existe no caminho
        for (const pattern of specificPatterns) {
            if (normalizedPath.includes(pattern)) {
                return pattern;
            }
        }

        return null;
    }

    #isValidSectionPath(sectionPath) {
        return sectionPath && typeof sectionPath === "string";
    }

    #findHyphenPositions(text) {
        const positions = [];
        const regex = /\s-\s|\s-\S/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Garante que pegamos o índice real do hífen
            const hyphenIndex = text.indexOf("-", match.index);
            positions.push(hyphenIndex);
        }

        return positions;
    }

    #isCIReference(reference) {
        return (
            reference && typeof reference === "string" && reference.toUpperCase().startsWith("CI")
        );
    }

    #extractStyleSegment(normalizedPath, hyphenPositions, isCIReference) {
        const segmentIndex = isCIReference ? 2 : 1;
        const startPos = hyphenPositions[segmentIndex] + 1;
        const endPos = hyphenPositions[segmentIndex + 1];

        return normalizedPath.slice(startPos, endPos).trim();
    }

    #normalizeStyleName(styleName) {
        const styleMap = {
            "JUV FEM": "JUVENIL FEMININO",
            "INF JUV MASC": "INFANTOJUVENIL MASCULINO",
            "INF JUV FEM": "INFANTOJUVENIL FEMININO",
            ACESSORIOS: "ACESSÓRIOS",
        };

        return styleMap[styleName] || styleName;
    }

    /**
     * Remove números e códigos do início da descrição
     * @param {string} description - Descrição do produto
     * @returns {string} Descrição sem números/códigos iniciais
     * @private
     */
    #removeLeadingNumbers(description) {
        if (!description || typeof description !== "string") {
            return description;
        }

        return description
            .replace(/^\d+(-\d+\.\d+)?\s*/, "")
            .replace(/^[A-Z]+\d+\s*/, "")
            .trim();
    }

    /**
     * Converte string de preço para número
     * @param {string|number} priceString - String do preço
     * @returns {number} Preço formatado
     */
    parsePrice(priceString) {
        if (!priceString && priceString !== 0) return 0;

        const cleanPrice = priceString.toString().trim().replace(",", ".");
        const parsed = parseFloat(cleanPrice);

        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    }

    /**
     * Processa todos os produtos - VERSÃO CORRIGIDA
     * @private
     */
    async #processProducts(products) {
        const results = [];
        const errors = [];

        // Reinicia o estado
        this.processingResults = [];
        this.currentProduct = this.#createEmptyProduct();

        console.log("=== INICIANDO PROCESSAMENTO DE PRODUTOS ===");
        console.log("Total de produtos:", products.length);

        for (const [index, product] of products.entries()) {
            try {
                console.log(`\n--- Processando produto ${index + 1}/${products.length} ---`);
                console.log("Produto:", product);

                await this.#processIndividualProduct(product);
            } catch (error) {
                console.error(`Erro ao processar produto ${index + 1}:`, error.message);
                errors.push({
                    product: product,
                    index: index + 1,
                    error: error.message,
                });
            }
        }

        // Adiciona produtos salvos durante o processamento
        results.push(...this.processingResults);

        // CORREÇÃO PRINCIPAL: Finaliza o último produto se existir
        if (this.currentProduct.reference) {
            try {
                console.log("\n=== FINALIZANDO ÚLTIMO PRODUTO ===");
                console.log("Produto atual:", this.currentProduct);

                const savedProduct = await this.#saveProduct({ ...this.currentProduct });
                results.push(savedProduct);
                console.log("Último produto salvo com sucesso:", savedProduct);
            } catch (error) {
                console.error("Erro ao salvar último produto:", error.message);
                errors.push({
                    product: this.currentProduct,
                    index: "último",
                    error: error.message,
                });
            }
        }

        // Limpa o estado após processamento
        this.processingResults = [];
        this.currentProduct = this.#createEmptyProduct();

        console.log(`\n=== PROCESSAMENTO FINALIZADO ===`);
        console.log(`Sucessos: ${results.length}, Erros: ${errors.length}`);

        // Salvar no localStorage se necessário
        if (results.length > 0) {
            await this.#saveToLocalStorage(results);
        }

        return { results, errors };
    }

    /**
     * Salva resultados no localStorage
     * @private
     */
    async #saveToLocalStorage(results) {
        try {
            const desejaSalvar = confirm("Deseja salvar os dados tratados no navegador?");

            if (desejaSalvar) {
                const listaAtual = JSON.parse(localStorage.getItem("productList")) || [];

                const novosProdutos = results.flatMap((r) => {
                    const data = r.data;
                    return [
                        ...(data?.savedProducts || []),
                        ...(data?.updatedProducts?.map((p) => {
                            const product = p.product;
                            return {
                                description: product.description,
                                reference: product.reference,
                                fashionStyle: product.fashionStyle,
                                sizes: product.sizes,
                                colors: product.colors,
                                price: product.price,
                            };
                        }) || []),
                    ];
                });

                const novaLista = novosProdutos.concat(listaAtual);
                localStorage.setItem("productList", JSON.stringify(novaLista));

                this.showMessage("Dados adicionados ao localStorage com sucesso!", "success");
            }
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
            this.showMessage("Erro ao salvar os dados localmente.", "error");
        }
    }

    /**
     * Salva produto no banco
     * @private
     */
    async #saveProduct(productData) {
        try {
            const validatedProduct = this.#validateProductData(productData);
            console.log("Produto validado:", validatedProduct);

            const savedProduct = await this.#saveProductToDatabase(validatedProduct);
            return savedProduct;
        } catch (error) {
            console.error("Erro na validação do produto:", error.message);
            throw error;
        }
    }

    /**
     * Processa um produto individual - VERSÃO CORRIGIDA
     * @private
     */
    async #processIndividualProduct({ fashionStyle, reference, description, price }) {
        console.log("DEBUG: Processando produto individual");
        console.log("Referência do produto atual do CSV:", reference);
        console.log("Referência base do currentProduct:", this.currentProduct.reference);

        // Se currentProduct.reference está vazio, é o primeiro produto ou um novo grupo.
        // Se a nova referência não contém a referência base atual, também é um novo grupo.
        const isNewProductGroup =
            !this.currentProduct.reference || !reference.includes(this.currentProduct.reference);

        if (isNewProductGroup) {
            console.log("Detectado como NOVO grupo de produto.");
            await this.#startNewProduct(fashionStyle, reference, description, price);
        } else {
            console.log("Detectado como VARIAÇÃO do produto atual.");
            this.#processProductVariant(reference, description);
        }
    }

    /**
     * Processa a referência base - obs: Apenas quando é um novo produto
     * @private
     */
    #processBaseReference(reference, description) {
        console.log("Processando referência:", reference);

        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        // Caso especial: referência começa com LA e termina com tamanho conhecido
        if (
            refUpper.startsWith("LA") &&
            ProductProcessor.SIZES.some((size) => refUpper.endsWith(size))
        ) {
            console.log("Referência começa com 'LA' e termina com tamanho. Removendo tamanho.");

            const referenceWithoutInfoSize = this.#removeSizeFromReference(reference, description);

            if (!referenceWithoutInfoSize) {
                console.log("Não foi possível remover o tamanho. Retornando referência original.");
                return reference;
            }

            const referenceBase = this.#processColor(referenceWithoutInfoSize);

            this.currentProduct.sizes = "P AO GG";
            return referenceBase;
        }

        // Verifica se a descrição contém padrões ou se a referência termina com 'U'
        const hasSizePattern = this.#hasSizePatternInDescription(descUpper);
        const endsWithU = refUpper.endsWith("U");

        if (!hasSizePattern && !endsWithU) {
            console.log("Condições de tamanho não atendidas. Retornando referência original.");
            return reference;
        }

        const referenceWithoutInfoSize = this.#removeSizeFromReference(reference, description);

        if (!referenceWithoutInfoSize) {
            console.log("Não foi possível remover o tamanho. Retornando referência original.");
            return reference;
        }

        return this.#processColor(referenceWithoutInfoSize);
    }

    // Função auxiliar privada para remover sufixo de tamanho baseado na descrição
    #removeSizeFromReference(reference, description) {
        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        if (refUpper.endsWith("U")) {
            if (refUpper.slice(-1) === descUpper.slice(-1)) {
                return reference.slice(0, -1);
            }
        }

        if (refUpper.slice(-3) === descUpper.slice(-3)) {
            return reference.slice(0, -3);
        } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
            return reference.slice(0, -2);
        } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
            return reference.slice(0, -1);
        }

        return null;
    }

    // Função auxiliar privada para tratar a cor e retornar a base da referência
    #processColor(referenceWithoutSize) {
        console.log("Referência sem informação do tamanho:", referenceWithoutSize);
        console.log("Removendo informação de cor da referência.");

        this.#addColorToCurrentProduct(this.#extractColorCodeFromReference(referenceWithoutSize));

        const referenceBase = this.#removeColorCodeFromReference(referenceWithoutSize);
        console.log("Referência sem informação da cor:", referenceBase);

        return referenceBase;
    }

    /**
     * Processa variante de produto (adiciona cor)
     * @private
     */
    #processProductVariant(reference, description) {
        console.log("DEBUG: Processando variante");
        console.log("Referência completa:", reference);
        console.log("Referência base atual:", this.currentProduct.reference);

        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        let referenceWithoutInfoSize;

        if (refUpper.endsWith("U")) {
            if (refUpper.slice(-1) === descUpper.slice(-1)) {
                referenceWithoutInfoSize = reference.slice(0, -1);

                console.log("referencia sem informação do tamanho: ", referenceWithoutInfoSize);

                console.log(
                    "vamos tirar a informação de cor da referencia: ",
                    referenceWithoutInfoSize,
                );
                this.#addColorToCurrentProduct(
                    this.#extractColorCodeFromReference(referenceWithoutInfoSize),
                );
                return;
            }
        }

        if (refUpper.slice(-3) === descUpper.slice(-3)) {
            referenceWithoutInfoSize = reference.slice(0, -3);
        } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
            referenceWithoutInfoSize = reference.slice(0, -2);
        } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
            referenceWithoutInfoSize = reference.slice(0, -1);
        }

        console.log("referencia sem informação do tamanho: ", referenceWithoutInfoSize);

        console.log("vamos tirar a informação de cor da referencia: ", referenceWithoutInfoSize);
        this.#addColorToCurrentProduct(
            this.#extractColorCodeFromReference(referenceWithoutInfoSize),
        );
    }

    /**
     * Verifica se a descrição contém padrões de tamanho válidos
     * @param {string} descUpper - Descrição em maiúsculas
     * @returns {boolean}
     * @private
     */
    #hasSizePatternInDescription(descUpper) {
        return ProductProcessor.SIZE_PATTERNS_REGEX.some((pattern) => pattern.test(descUpper));
    }

    /**
     * Remove a informação da cor na referência
     * @private
     */
    #removeColorCodeFromReference(reference) {
        const lastChar = reference.slice(-1);
        const lastTwoChars = reference.slice(-2);
        const isLastCharNumeric = !isNaN(Number(lastChar));
        const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

        if (isLastTwoCharsNumeric) {
            return reference.slice(0, -4);
        } else if (isLastCharNumeric) {
            return reference.slice(0, -3);
        } else {
            return reference;
        }
    }

    /**
     * Extrai a informação da cor na referência
     * @private
     */
    #extractColorCodeFromReference(reference) {
        const lastChar = reference.slice(-1);
        const lastTwoChars = reference.slice(-2);
        const isLastCharNumeric = !isNaN(Number(lastChar));
        const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

        let colorCode;

        if (isLastTwoCharsNumeric) {
            colorCode = reference.slice(-4);
        } else if (isLastCharNumeric) {
            colorCode = reference.slice(-3);
        } else {
            colorCode = "";
        }

        return colorCode === ProductProcessor.SORTED_REFERENCE_CODE
            ? ProductProcessor.SORTED_CODE
            : colorCode;
    }

    /**
     * Adiciona cor ao produto atual
     * @private
     */
    #addColorToCurrentProduct(colorCode) {
        console.log("DEBUG: Adicionando cor ao produto atual");
        console.log("Código de cor a adicionar:", colorCode);
        console.log("Cores atuais antes:", this.currentProduct.colors);

        if (!colorCode) return;

        if (Array.isArray(this.currentProduct.colors)) {
            const onlySorted =
                this.currentProduct.colors.length === 1 &&
                this.currentProduct.colors[0] === ProductProcessor.SORTED_CODE;

            if (onlySorted) {
                // Substitui ["SORTIDO"] pela cor real
                this.currentProduct.colors = [colorCode];
            } else if (!this.currentProduct.colors.includes(colorCode)) {
                this.currentProduct.colors.push(colorCode);
            }
        } else {
            // Se for algo inesperado, normaliza como array com a nova cor
            this.currentProduct.colors = [colorCode];
        }

        console.log("Cores após adição:", this.currentProduct.colors);
    }

    /**
     * Inicia um novo produto
     * @private
     */

    async #startNewProduct(fashionStyle, reference, description, price) {
        console.log("DEBUG: Iniciando novo produto");
        console.log("Vamos iniciar um novo produto: ", fashionStyle, reference, description, price);

        if (this.currentProduct.reference) {
            try {
                console.log(
                    "Salvando produto anterior antes de iniciar um novo:",
                    this.currentProduct,
                );
                const savedProduct = await this.#saveProduct({ ...this.currentProduct });
                this.processingResults.push(savedProduct); // Armazena o resultado de sucesso
                console.log("Produto anterior salvo com sucesso.");
            } catch (error) {
                console.error(
                    "Erro ao salvar produto anterior. Prosseguindo com o próximo...",
                    error.message,
                );
                // Permite que o processamento continue mesmo que o anterior falhe
                // O erro já é registrado em #processProducts
            }
        }

        // Inicializa novo produto

        this.currentProduct = this.#createEmptyProduct();

        // Agora que this.currentProduct existe, você pode adicionar dados com segurança
        this.currentProduct.fashionStyle = fashionStyle;
        this.currentProduct.price = price;
        this.currentProduct.colors = [ProductProcessor.SORTED_CODE];
        this.currentProduct.sizes = this.#extractSizes(description);
        this.currentProduct.reference = this.#processBaseReference(reference, description);
        this.currentProduct.description = this.#cleanDescription(description);
        this.#removeSizeInfoDescription();
        console.log("Novo produto inicializado:", this.currentProduct);
    }

    /**
     * Remove palavras de cores da descrição
     * @private
     */
    #removeColorWordsFromDescription(description) {
        if (!description || typeof description !== "string") return description;

        const descUpper = description.toUpperCase();
        const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA", "BODY"];

        // Verifica se deve manter as cores na descrição
        const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
            descUpper.startsWith(product),
        );
        if (shouldKeepColor) return description;

        let newDescription = description;

        // Remove cor no início da descrição, se existir
        for (const color of ProductProcessor.COLOR_WORDS) {
            const regexStart = new RegExp(`^${color}\\s*`, "i");
            if (regexStart.test(newDescription)) {
                newDescription = newDescription.replace(regexStart, "").trim();
                break;
            }
        }

        // Remove qualquer cor no meio ou fim da descrição
        const descUpperAfterStart = newDescription.toUpperCase();
        let earliestColorIndex = -1;
        for (const color of ProductProcessor.COLOR_WORDS) {
            const index = descUpperAfterStart.indexOf(color);
            if (index !== -1 && (earliestColorIndex === -1 || index < earliestColorIndex)) {
                earliestColorIndex = index;
            }
        }

        if (earliestColorIndex !== -1) {
            newDescription = newDescription.slice(0, earliestColorIndex).trim();
        }

        return newDescription;
    }

    /**
     * Limpa descrição removendo elementos desnecessários
     * @private
     */
    #cleanDescription(description) {
        if (!description || typeof description !== "string") {
            return description || "";
        }

        console.log("DEBUG: cleanDescription - entrada:", description);

        // Remove códigos específicos
        const cleaned = description
            .replace(/SORTIDOU|SORTIDO|SORTIMENTO|ÚNICAU/gi, "")
            .replace(ProductProcessor.UNIT_PATTERNS, "")
            .trim();

        console.log("DEBUG: cleanDescription - após limpeza básica:", cleaned);

        // Remove cores
        const withoutColors = this.#removeColorWordsFromDescription(cleaned);
        console.log("DEBUG: cleanDescription - após remoção de cores:", withoutColors);

        // Remove códigos numéricos no final
        const withoutEndCodes = withoutColors.replace(/\s+\d{3,}\w*$/g, "").trim();
        console.log("DEBUG: cleanDescription - resultado final:", withoutEndCodes);

        return withoutEndCodes;
    }

    #removeSizeInfoDescription() {
        if (this.currentProduct.sizes === ProductProcessor.DEFAULT_SIZE) return;

        console.log("ultima limpeza da descrição");

        const descUpper = this.currentProduct.description.toUpperCase();

        // ✅ Tenta encontrar o padrão de tamanho na descrição usando regex
        for (const pattern of ProductProcessor.SIZE_PATTERNS_REGEX) {
            const match = descUpper.match(pattern);
            if (match) {
                const foundSize = match[1];
                const sizeIndex = match.index;

                // Remove o tamanho encontrado da descrição
                this.currentProduct.description = this.currentProduct.description
                    .slice(0, sizeIndex)
                    .trim();

                console.log(`Removido "${foundSize}" da descrição na posição ${sizeIndex}`);
                break; // Para após encontrar o primeiro
            }
        }

        // Correções específicas (agora só normalizações, não precisa mais do " AO GG")
        if (this.currentProduct.sizes === "G1 AO G2") {
            this.currentProduct.sizes = "G1 AO G3";
        }
    }

    /**
     * Extrai informações de tamanho da descrição
     * @private
     */
    #extractSizes(description) {
        if (!description) return ProductProcessor.DEFAULT_SIZE;

        const normalizedDescription = description.toUpperCase();

        const EXCEPTIONS = {
            " AO GG": "P AO GG",
            "36 A 52": "36 AO 52",
        };

        // ✅ Tenta encontrar o padrão na descrição usando regex
        for (const pattern of ProductProcessor.SIZE_PATTERNS_REGEX) {
            const match = normalizedDescription.match(pattern);
            if (match) {
                let extractedSize = match[1];

                // ✅ NORMALIZA "A" para "AO"
                extractedSize = extractedSize.replace(/\s+A\s+/g, " AO ");

                // Aplica exceções se necessário
                return EXCEPTIONS[extractedSize] || extractedSize;
            }
        }

        return ProductProcessor.DEFAULT_SIZE;
    }
}

/**
 * Factory para criar instância do ProductProcessor
 */
class ProductProcessorFactory {
    static create(apiBaseUrl) {
        return new ProductProcessor(apiBaseUrl);
    }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    try {
        const productProcessor = ProductProcessorFactory.create(
            "https://api-ponto-da-moda.onrender.com/api/description",
        );

        // Disponibiliza globalmente para debug
        window.productProcessor = productProcessor;

        console.log("ProductProcessor inicializado com sucesso");
    } catch (error) {
        console.error("Erro ao inicializar ProductProcessor:", error);
    }
});

// Export para uso em módulos
if (typeof module !== "undefined" && module.exports) {
    module.exports = { ProductProcessor, ProductProcessorFactory };
}
