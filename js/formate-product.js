/**
 * Gerenciador de formatação de produtos
 * Processa dados CSV de produtos e organiza informações como referência, descrição, tamanhos e cores
 */
class ProductFormatManager {
    // Constantes da classe
    static SIZE_PATTERNS = [
        "P AO GG",
        " AO GG",
        "P AO G",
        "G1 AO G3",
        "1 AO 3",
        "1 AO 10",
        "4 AO 8",
        "4 AO 10",
        "4 AO 12",
        "4 AO 14",
        "4 AO 16",
        "10 AO 14",
        "10 AO 16",
        "12 AO 16",
        "36 AO 44",
        "36 AO 46",
        "36 AO 48",
        "36 AO 52",
        "38 AO 46",
        "38 AO 48",
        "46 AO 50",
        "46 AO 52",
        "48 AO 52",
        "48 AO 54",
    ];

    static COLOR_WORDS = [
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
    ];

    static UNIT_PATTERNS = /\s?\((un|pç|pc|cj)\)/i;
    static STORAGE_KEY = "productList";
    static SORTED_CODE = "SORTIDO";
    static SORTED_REFERENCE_CODE = "SO1";
    static DEFAULT_SIZE = "ÚNICO";

    // Enums para melhor tipagem
    static REFERENCE_LENGTH = {
        SHORT: 10,
        LONG: 17,
    };

    constructor() {
        this.productList = this.#loadProductList();
        this.currentProduct = this.#createEmptyProduct();
        this.#initializeForm();
    }

    /**
     * Inicializa o formulário e adiciona event listeners
     * @private
     */
    #initializeForm() {
        const form = document.querySelector(".form--formate-product-descriptiom");
        if (!form) {
            console.error("Formulário não encontrado");
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
                throw new Error("Dados CSV não fornecidos");
            }

            const products = this.#parseCSVData(csvData);
            this.#processProducts(products);

            // Limpa o textarea após processamento bem-sucedido
            event.target.csvInput.value = "";

            console.log(`Processamento concluído: ${products.length} produtos processados`);
        } catch (error) {
            console.error("Erro ao processar produtos:", error.message);
            throw error; // Re-throw para permitir tratamento pela UI
        }
    }

    /**
     * Carrega lista de produtos do localStorage
     * @private
     */
    #loadProductList() {
        try {
            const stored = localStorage.getItem(ProductFormatManager.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Erro ao carregar lista de produtos:", error);
            return [];
        }
    }

    /**
     * Atualiza localStorage com a lista atual
     * @private
     */
    #updateLocalStorage() {
        try {
            localStorage.setItem(
                ProductFormatManager.STORAGE_KEY,
                JSON.stringify(this.productList)
            );
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
            throw new Error("Falha ao salvar dados localmente");
        }
    }

    /**
     * Cria um produto vazio com estrutura padrão
     * @private
     */
    #createEmptyProduct() {
        return {
            description: "",
            reference: "",
            sizes: "",
            colors: [],
            price: 0,
        };
    }

    /**
     * Converte string de preço para número
     * @param {string|number} priceString - String do preço
     * @returns {number} Preço formatado
     */
    parsePrice(priceString) {
        if (!priceString) return 0;

        const cleanPrice = priceString.toString().trim().replace(",", ".");
        const parsed = parseFloat(cleanPrice);

        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
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

            if (columns.length < 2) {
                throw new Error(`Formato inválido - esperado pelo menos 2 colunas`);
            }

            const { reference, description } = this.#parseFirstColumn(columns[0]);
            const price = this.parsePrice(columns[1]);

            return { reference, description, price };
        } catch (error) {
            console.error(`Erro na linha ${index + 1}:`, error.message);
            return null;
        }
    }

    /**
     * Faz parse da primeira coluna (referência - descrição)
     * @private
     */
    #parseFirstColumn(firstColumn) {
        const parts = firstColumn.split(" - ");
        if (parts.length < 2) {
            throw new Error("Formato inválido - esperado 'referencia - descrição'");
        }

        const [reference, rawDescription] = parts.map((s) => s.trim());
        const description = rawDescription.replace(ProductFormatManager.UNIT_PATTERNS, "").trim();

        return { reference, description };
    }

    /**
     * Processa todos os produtos
     * @private
     */
    #processProducts(products) {
        products.forEach((product) => this.#processIndividualProduct(product));

        // Finaliza o último produto se existir
        if (this.currentProduct.reference) {
            this.addProductToList({ ...this.currentProduct });
        }
    }

    /**
     * Processa um produto individual baseado no comprimento da referência
     * @private
     */
    #processIndividualProduct({ reference, description, price }) {
        const refLength = reference.length;

        if (refLength <= ProductFormatManager.REFERENCE_LENGTH.SHORT) {
            this.#processShortReference(reference, description, price);
        } else if (refLength <= ProductFormatManager.REFERENCE_LENGTH.LONG) {
            this.#processLongReference(reference, description, price);
        } else {
            this.#processShortReference(reference, description, price);
        }
    }

    /**
     * Processa referências longas (variações de produto)
     * @private
     */
    #processLongReference(reference, description, price) {
        const isVariant = this.#isVariantOfCurrentProduct(reference);

        if (isVariant) {
            this.#processProductVariant(reference, description);
        } else {
            this.#startNewProduct(reference, description, price);
        }
    }

    /**
     * Verifica se é uma variante do produto atual
     * @private
     */
    #isVariantOfCurrentProduct(reference) {
        return this.currentProduct.reference && reference.includes(this.currentProduct.reference);
    }

    /**
     * Processa variante de produto (adiciona cor)
     * @private
     */
    #processProductVariant(reference, description) {
        const cleanedReference = this.#removeMatchingSuffix(reference, description);
        const colorCode = this.#extractColorCode(cleanedReference);

        if (colorCode) {
            this.#addColorToCurrentProduct(colorCode);
        }
    }

    /**
     * Adiciona cor ao produto atual
     * @private
     */
    #addColorToCurrentProduct(colorCode) {
        if (colorCode === ProductFormatManager.SORTED_CODE) {
            this.currentProduct.colors = ProductFormatManager.SORTED_CODE;
        } else if (
            Array.isArray(this.currentProduct.colors) &&
            !this.currentProduct.colors.includes(colorCode)
        ) {
            this.currentProduct.colors.push(colorCode);
        }
    }

    /**
     * Inicia um novo produto
     * @private
     */
    #startNewProduct(reference, description, price) {
        // Salva produto anterior
        if (this.currentProduct.reference) {
            this.addProductToList({ ...this.currentProduct });
        }

        // Inicializa novo produto
        this.currentProduct = this.#createEmptyProduct();
        this.currentProduct.sizes = this.#extractSizes(description);
        this.currentProduct.price = this.parsePrice(price);
        this.currentProduct.description = this.#cleanDescription(description);

        this.#processNewProductReference(reference, description);
        this.#updateDescriptionWithSizes();
    }

    /**
     * Processa referência do novo produto
     * @private
     */
    #processNewProductReference(reference, description) {
        const cleanedReference = this.#removeMatchingSuffix(reference, description);
        const colorCode = this.#extractColorCode(cleanedReference);

        if (colorCode) {
            this.#addColorToCurrentProduct(colorCode);
            this.currentProduct.reference = this.#removeColorCodeFromReference(cleanedReference);
        } else {
            this.currentProduct.reference = cleanedReference;
        }
    }

    /**
     * Processa referências curtas
     * @private
     */
    #processShortReference(reference, description, price) {
        this.addProductToList({
            reference,
            description,
            price,
            sizes: ProductFormatManager.DEFAULT_SIZE,
            colors: ProductFormatManager.SORTED_CODE,
        });
    }

    /**
     * Remove sufixo correspondente entre referência e descrição
     * @private
     */
    #removeMatchingSuffix(reference, description) {
        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        if (refUpper.slice(-2) === descUpper.slice(-2)) {
            return reference.slice(0, -2);
        } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
            return reference.slice(0, -1);
        }

        return reference;
    }

    /* ***************************************************************************************************************************************************************** */

    // /**
    //  * Extrai código de cor da referência
    //  * @private
    //  */
    // #extractColorCode(reference) {
    //     const lastTwoChars = reference.slice(-2);
    //     const isNumeric = !isNaN(Number(lastTwoChars));

    //     const colorCode = isNumeric ? reference.slice(-4) : reference.slice(-3);

    //     return colorCode === ProductFormatManager.SORTED_REFERENCE_CODE ?
    //            ProductFormatManager.SORTED_CODE : colorCode;
    // }

    // /**
    //  * Remove código de cor da referência
    //  * @private
    //  */
    // #removeColorCodeFromReference(reference) {
    //     const lastTwoChars = reference.slice(-2);
    //     const isNumeric = !isNaN(Number(lastTwoChars));

    //     return isNumeric ? reference.slice(0, -4) : reference.slice(0, -3);
    // }

    /* *********************************************************************************************************************************************************** */

    #extractColorCode(reference) {
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
            colorCode = ""; // Se não terminar com número, não há código de cor
        }

        return colorCode === ProductFormatManager.SORTED_REFERENCE_CODE
            ? ProductFormatManager.SORTED_CODE
            : colorCode;
    }

    /**
     * Remove código de cor da referência
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
            return reference; // Sem alteração se não termina com número
        }
    }

    /* ***************************************************************************************************************************************************************** */

    /**
     * Remove palavras de cores da descrição
     * @private
     */
    // #removeColorWordsFromDescription(description) {
    //     const descUpper = description.toUpperCase();
    //     let minIndex = -1;

    //     for (const color of ProductFormatManager.COLOR_WORDS) {
    //         const index = descUpper.indexOf(color);
    //         if (index !== -1 && (minIndex === -1 || index < minIndex)) {
    //             minIndex = index;
    //         }
    //     }

    //     return minIndex !== -1 ? description.slice(0, minIndex).trim() : description.trim();
    // }

    #removeColorWordsFromDescription(description) {
        const descUpper = description.toUpperCase();
        let minIndex = -1;
        let matchedColor = "";

        // Primeiro: verifica se a cor está no início
        for (const color of ProductFormatManager.COLOR_WORDS) {
            const index = descUpper.indexOf(color);
            if (index === 0) {
                matchedColor = color;
                break;
            }
        }

        let newDescription = description;

        if (matchedColor) {
            // Se tinha cor no início, remove só essa cor
            const regexStart = new RegExp(`^${matchedColor}\\s*`, "i");
            newDescription = newDescription.replace(regexStart, "").trim();
        }

        // Agora faz uma nova varredura na descrição limpa
        const newDescUpper = newDescription.toUpperCase();
        minIndex = -1;
        for (const color of ProductFormatManager.COLOR_WORDS) {
            const index = newDescUpper.indexOf(color);
            if (index !== -1 && (minIndex === -1 || index < minIndex)) {
                minIndex = index;
            }
        }

        // Se achar outra cor, corta até ela
        if (minIndex !== -1) {
            newDescription = newDescription.slice(0, minIndex).trim();
        }

        return newDescription;
    }

    /**
     * Limpa descrição removendo elementos desnecessários
     * @private
     */

    #cleanDescription(description) {
        const cleaned = description
            .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
            .replace(ProductFormatManager.UNIT_PATTERNS, "")
            .trim();

        return this.#removeColorWordsFromDescription(cleaned);
    }

    /**
     * Atualiza descrição removendo informações de tamanho
     * @private
     */
    #updateDescriptionWithSizes() {
        if (this.currentProduct.sizes === ProductFormatManager.DEFAULT_SIZE) return;

        const sizeIndex = this.currentProduct.description
            .toUpperCase()
            .indexOf(this.currentProduct.sizes);

        if (sizeIndex !== -1) {
            this.currentProduct.description = this.currentProduct.description
                .slice(0, sizeIndex)
                .trim();
        }

        // Correção específica para " AO GG"
        if (this.currentProduct.sizes === " AO GG") {
            this.currentProduct.sizes = "P AO GG";
        }
    }

    /**
     * Extrai informações de tamanho da descrição
     * @private
     */
    #extractSizes(description) {
        const normalizedDescription = description.toUpperCase();

        for (const size of ProductFormatManager.SIZE_PATTERNS) {
            if (normalizedDescription.includes(size)) {
                return size;
            }
        }

        return ProductFormatManager.DEFAULT_SIZE;
    }

    /**
     * Adiciona produto à lista
     */
    addProductToList(productData) {
        const product = {
            description: productData.description || "",
            reference: productData.reference || "",
            sizes: productData.sizes || ProductFormatManager.DEFAULT_SIZE,
            colors: this.#formatColors(productData.colors),
            price: this.parsePrice(productData.price) || 0,
        };

        this.productList.unshift(product);
        this.#updateLocalStorage();
    }

    /**
     * Formata cores para exibição
     * @private
     */
    #formatColors(colors) {
        if (typeof colors === "string") {
            return colors;
        }

        if (Array.isArray(colors) && colors.length > 0) {
            return colors.join(" - ");
        }

        return ProductFormatManager.SORTED_CODE;
    }

    // Métodos públicos da API
    getProductList() {
        return [...this.productList];
    }

    clearProductList() {
        this.productList = [];
        this.#updateLocalStorage();
    }

    getFormattedProductList() {
        return this.productList.map((product) => ({
            ...product,
            formattedColors: this.#formatColors(product.colors),
        }));
    }

    exportProductList() {
        return JSON.stringify(this.productList, null, 2);
    }

    getProductCount() {
        return this.productList.length;
    }

    findProductByReference(reference) {
        return this.productList.find((product) => product.reference === reference);
    }

    filterProductsBySize(size) {
        return this.productList.filter((product) => product.sizes.includes(size));
    }

    filterProductsByColor(color) {
        return this.productList.filter(
            (product) =>
                product.colors.includes(color) ||
                product.colors === ProductFormatManager.SORTED_CODE
        );
    }
}

/**
 * Factory para criar instância do ProductFormatManager
 */
class ProductFormatManagerFactory {
    static create() {
        return new ProductFormatManager();
    }
}

// Inicialização com melhor tratamento de erros
document.addEventListener("DOMContentLoaded", () => {
    try {
        const productManager = ProductFormatManagerFactory.create();

        // Disponibiliza globalmente para debug/console
        window.productManager = productManager;

        console.log("ProductFormatManager inicializado com sucesso");
    } catch (error) {
        console.error("Erro ao inicializar ProductFormatManager:", error);
    }
});

// Export para uso em módulos
if (typeof module !== "undefined" && module.exports) {
    module.exports = { ProductFormatManager, ProductFormatManagerFactory };
}
