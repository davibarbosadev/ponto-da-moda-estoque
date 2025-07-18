// /**
//  * Processador de formatação de produtos para banco de dados
//  * Processa dados CSV de produtos e envia para o banco
//  */
// class ProductProcessor {
//     // Constantes da classe
//     static SIZE_PATTERNS = [
//         "P AO GG",
//         " AO GG",
//         "P AO G",
//         "P AO XGG",
//         "G1 AO G3",
//         "1 AO 3",
//         "1 AO 10",
//         "4 AO 8",
//         "4 AO 10",
//         "4 AO 12",
//         "4 AO 14",
//         "4 AO 16",
//         "10 AO 14",
//         "10 AO 16",
//         "12 AO 16",
//         "36 AO 44",
//         "36 AO 46",
//         "36 AO 48",
//         "36 AO 52",
//         "38 AO 46",
//         "38 AO 48",
//         "40 AO 46",
//         "46 AO 50",
//         "46 AO 52",
//         "48 AO 52",
//         "48 AO 54",
//     ];

//     static COLOR_WORDS = [
//         "BEGE",
//         "AZUL",
//         "MARINHO",
//         "ROSA",
//         "VERMELHO",
//         "PRETO",
//         "BRANCO",
//         "AMARELO",
//         "VERDE",
//         "LILÁS",
//         "CINZA",
//         "VINHO",
//         "OFF",
//         "LARANJA",
//         "ROXO",
//         "NUDE",
//         "MARROM",
//         "AREIA",
//         "SPLASH", // Adicionado para lidar com "SPLASH"
//     ];

//     static UNIT_PATTERNS = /\s?\((un|pç|pc|cj|par)\)/i;
//     static SORTED_CODE = "SORTIDO";
//     static SORTED_REFERENCE_CODE = "SO1";
//     static DEFAULT_SIZE = "ÚNICO";

//     constructor(apiBaseUrl = "/api/description") {
//         this.apiBaseUrl = apiBaseUrl;
//         this.currentProduct = this.#createEmptyProduct();
//         this.processingResults = [];
//         this.#initializeForm();
//         this.#createMessageElement();
//     }

//     /**
//      * Cria o elemento de mensagem se não existir
//      * @private
//      */
//     #createMessageElement() {
//         if (!document.querySelector(".message-display")) {
//             const messageElement = document.createElement("div");
//             messageElement.className = "message-display";

//             Object.assign(messageElement.style, {
//                 position: "fixed",
//                 top: "20px",
//                 right: "20px",
//                 padding: "12px 20px",
//                 borderRadius: "4px",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 zIndex: "9999",
//                 maxWidth: "400px",
//                 opacity: "0",
//                 transform: "translateX(100%)",
//                 transition: "all 0.3s ease-in-out",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             });

//             const style = document.createElement("style");
//             style.textContent = `
//                 .message-display.open {
//                     opacity: 1 !important;
//                     transform: translateX(0) !important;
//                 }
//             `;
//             document.head.appendChild(style);

//             document.body.appendChild(messageElement);
//         }
//     }

//     /**
//      * Exibe mensagem para o usuário
//      * @param {string} message - Mensagem a ser exibida
//      * @param {string} type - Tipo da mensagem (success, error, warning, info)
//      */
//     showMessage(message, type = "info") {
//         let messageElement = document.querySelector(".message-display");

//         if (!messageElement) {
//             this.#createMessageElement();
//             messageElement = document.querySelector(".message-display");
//         }

//         const styles = {
//             success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
//             error: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
//             warning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" },
//             info: { backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" },
//         };

//         const style = styles[type] || styles.info;
//         Object.assign(messageElement.style, style);

//         messageElement.textContent = message;
//         messageElement.classList.add("open");

//         setTimeout(() => {
//             messageElement.classList.remove("open");
//         }, 3000);
//     }

//     /**
//      * Inicializa o formulário e adiciona event listeners
//      * @private
//      */
//     #initializeForm() {
//         const form = document.querySelector(".form--formate-product-description");
//         if (!form) {
//             console.error("Formulário não encontrado");
//             this.showMessage("Erro: Formulário não encontrado", "error");
//             return;
//         }

//         form.addEventListener("submit", this.#handleFormSubmit.bind(this));
//     }

//     /**
//      * Manipula o submit do formulário
//      * @private
//      */
//     async #handleFormSubmit(event) {
//         event.preventDefault();

//         try {
//             const csvData = event.target.csvInput?.value?.trim();

//             if (!csvData) {
//                 this.showMessage("Por favor, insira os dados CSV", "warning");
//                 return;
//             }

//             const products = this.#parseCSVData(csvData);

//             if (products.length === 0) {
//                 this.showMessage("Nenhum produto válido encontrado nos dados CSV", "warning");
//                 return;
//             }

//             this.showMessage("Processando produtos...", "info");

//             const { results, errors } = await this.#processProducts(products);

//             // Limpa o textarea após processamento
//             event.target.csvInput.value = "";

//             // Exibe resultado detalhado
//             if (errors.length > 0) {
//                 const errorDetails = errors
//                     .map((err) => `Produto ${err.index}: ${err.error}`)
//                     .join("\n");

//                 console.error("Erros detalhados durante processamento:", errorDetails);

//                 this.showMessage(
//                     `${results.length} produto(s) salvos, ${errors.length} erro(s). Verifique o console para detalhes.`,
//                     "warning"
//                 );
//             } else {
//                 this.showMessage(`✓ ${results.length} produto(s) salvos no banco!`, "success");
//             }
//         } catch (error) {
//             console.error("Erro ao processar produtos:", error.message);
//             this.showMessage(`Erro ao processar produtos: ${error.message}`, "error");
//         }
//     }

//     /**
//      * Faz parse dos dados CSV
//      * @private
//      */
//     #parseCSVData(csvString) {
//         const lines = csvString.trim().split("\n");

//         return lines
//             .map((line, index) => this.#parseCSVLine(line, index))
//             .filter((product) => product !== null);
//     }

//     /**
//      * Faz parse de uma linha CSV
//      * @private
//      */
//     #parseCSVLine(line, index) {
//         try {
//             const columns = line.split(";").map((col) => col.replace(/"/g, "").trim());

//             if (columns.length < 3) {
//                 throw new Error(`Formato inválido - esperado pelo menos 3 colunas`);
//             }

//             const fashionStyle = this.#extractFashionStyle(columns[0]);
//             const { reference, description } = this.#parseSecondColumn(columns[1]);
//             const price = this.parsePrice(columns[2]);

//             // Validação básica
//             if (!fashionStyle || !reference || !description || !price) {
//                 throw new Error(`Dados incompletos na linha ${index + 1}`);
//             }

//             return { fashionStyle, reference, description, price };
//         } catch (error) {
//             console.error(`Erro na linha ${index + 1}:`, error.message);
//             return null;
//         }
//     }

//     /**
//      * Faz parse da segunda coluna (referência - descrição)
//      * @private
//      */
//     #parseSecondColumn(secondColumn) {
//         const parts = secondColumn.split(" - ");
//         if (parts.length < 2) {
//             throw new Error("Formato inválido - esperado 'referencia - descrição'");
//         }

//         let [reference, rawDescription] = parts.map((s) => s.trim());

//         if (!reference || !rawDescription) {
//             throw new Error("Referência ou descrição vazia");
//         }

//         rawDescription = this.#removeLeadingNumbers(rawDescription);
//         const description = rawDescription.replace(ProductProcessor.UNIT_PATTERNS, "").trim();

//         return { reference, description };
//     }

//     /**
//      * Envia produto para o banco de dados
//      * @param {Object} productData - Dados do produto
//      * @returns {Promise<Object>} Produto salvo
//      * @private
//      */
//     async #saveProductToDatabase(productData) {
//         try {
//             console.log("Dados do produto a ser enviado:", JSON.stringify(productData, null, 2));

//             const response = await fetch(this.apiBaseUrl, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "X-Requested-With": "XMLHttpRequest",
//                 },
//                 body: JSON.stringify(productData),
//             });

//             console.log("Status da resposta:", response.status);

//             const responseData = await response.json();
//             console.log("Resposta da API:", responseData);

//             if (!response.ok) {
//                 let errorMessage = responseData.message || `Erro HTTP: ${response.status}`;

//                 if (
//                     responseData.errors &&
//                     Array.isArray(responseData.errors) &&
//                     responseData.errors.length > 0
//                 ) {
//                     const specificErrors = responseData.errors
//                         .map((error) => {
//                             if (typeof error === "string") {
//                                 return error;
//                             } else if (error.message) {
//                                 return error.message;
//                             } else if (error.field && error.error) {
//                                 return `${error.field}: ${error.error}`;
//                             } else {
//                                 return JSON.stringify(error);
//                             }
//                         })
//                         .join("; ");

//                     errorMessage += ` - Detalhes: ${specificErrors}`;
//                 }

//                 console.error("Erro detalhado da API:", errorMessage);
//                 throw new Error(errorMessage);
//             }

//             return responseData;
//         } catch (error) {
//             console.error("Erro ao salvar produto no banco:", error);
//             throw error;
//         }
//     }

//     /**
//      * Cria um produto vazio com estrutura padrão
//      * @private
//      */
//     #createEmptyProduct() {
//         return {
//             fashionStyle: "",
//             description: "",
//             reference: "",
//             sizes: "",
//             colors: [],
//             price: 0,
//         };
//     }

//     /**
//      * Valida dados do produto antes de salvar
//      * @param {Object} productData - Dados do produto
//      * @returns {Object} Produto validado
//      * @private
//      */

//     #validateProductData(productData) {
//         console.log("DEBUG: validateProductData - entrada:", productData);

//         const validated = {
//             fashionStyle: (productData.fashionStyle || "").toString().trim(),
//             description: (productData.description || "").toString().trim(),
//             reference: (productData.reference || "").toString().trim(),
//             sizes: (productData.sizes || ProductProcessor.DEFAULT_SIZE).toString().trim(),
//             colors: Array.isArray(productData.colors)
//                 ? productData.colors
//                 : productData.colors === ProductProcessor.SORTED_CODE
//                 ? ProductProcessor.SORTED_CODE
//                 : [],
//             price: this.parsePrice(productData.price),
//         };

//         console.log("DEBUG: validateProductData - saída:", validated);

//         // Validações
//         const errors = [];
//         if (!validated.fashionStyle) errors.push("Fashion style é obrigatório");
//         if (!validated.description) errors.push("Descrição é obrigatória");
//         if (!validated.reference) errors.push("Referência é obrigatória");
//         if (!validated.price || validated.price <= 0) errors.push("Preço deve ser maior que zero");

//         if (errors.length > 0) {
//             throw new Error(`Erros de validação: ${errors.join("; ")}`);
//         }

//         return validated;
//     }

//     /**
//      * Extrai o fashionStyle do produto a partir da estrutura hierárquica
//      * @param {string} sectionPath - Caminho da seção
//      * @returns {string} FashionStyle formatado
//      * @private
//      */
//     #extractFashionStyle(sectionPath) {
//         if (!sectionPath || typeof sectionPath !== "string") {
//             return "";
//         }

//         const match = sectionPath.match(/ *- */);
//         const firstHyphenIndex = match ? match.index : -1;
//         const hyphenLength = match ? match[0].length : 0;

//         if (firstHyphenIndex === -1) {
//             return "";
//         }

//         const afterFirstHyphen = sectionPath.slice(firstHyphenIndex + hyphenLength).trimStart();
//         const firstDotOrSpaceIndex = afterFirstHyphen.search(/[. ]/);

//         if (firstDotOrSpaceIndex === -1) {
//             return afterFirstHyphen;
//         }

//         return afterFirstHyphen.slice(0, firstDotOrSpaceIndex).trim();
//     }

//     /**
//      * Remove números e códigos do início da descrição
//      * @param {string} description - Descrição do produto
//      * @returns {string} Descrição sem números/códigos iniciais
//      * @private
//      */
//     #removeLeadingNumbers(description) {
//         if (!description || typeof description !== "string") {
//             return description;
//         }

//         return description
//             .replace(/^\d+(-\d+\.\d+)?\s*/, "")
//             .replace(/^[A-Z]+\d+\s*/, "")
//             .trim();
//     }

//     /**
//      * Converte string de preço para número
//      * @param {string|number} priceString - String do preço
//      * @returns {number} Preço formatado
//      */
//     parsePrice(priceString) {
//         if (!priceString && priceString !== 0) return 0;

//         const cleanPrice = priceString.toString().trim().replace(",", ".");
//         const parsed = parseFloat(cleanPrice);

//         return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
//     }

//     /**
//      * Processa todos os produtos - VERSÃO CORRIGIDA
//      * @private
//      */
//     async #processProducts(products) {
//         const results = [];
//         const errors = [];

//         // Reinicia o estado
//         this.processingResults = [];
//         this.currentProduct = this.#createEmptyProduct();

//         console.log("=== INICIANDO PROCESSAMENTO DE PRODUTOS ===");
//         console.log("Total de produtos:", products.length);

//         for (const [index, product] of products.entries()) {
//             try {
//                 console.log(`\n--- Processando produto ${index + 1}/${products.length} ---`);
//                 console.log("Produto:", product);

//                 await this.#processIndividualProduct(product);
//             } catch (error) {
//                 console.error(`Erro ao processar produto ${index + 1}:`, error.message);
//                 errors.push({
//                     product: product,
//                     index: index + 1,
//                     error: error.message,
//                 });
//             }
//         }

//         // Adiciona produtos salvos durante o processamento
//         results.push(...this.processingResults);

//         // CORREÇÃO PRINCIPAL: Finaliza o último produto se existir
//         if (this.currentProduct.reference) {
//             try {
//                 console.log("\n=== FINALIZANDO ÚLTIMO PRODUTO ===");
//                 console.log("Produto atual:", this.currentProduct);

//                 const savedProduct = await this.#saveProduct({ ...this.currentProduct });
//                 results.push(savedProduct);
//                 console.log("Último produto salvo com sucesso:", savedProduct);
//             } catch (error) {
//                 console.error("Erro ao salvar último produto:", error.message);
//                 errors.push({
//                     product: this.currentProduct,
//                     index: "último",
//                     error: error.message,
//                 });
//             }
//         }

//         // Limpa o estado após processamento
//         this.processingResults = [];
//         this.currentProduct = this.#createEmptyProduct();

//         console.log(`\n=== PROCESSAMENTO FINALIZADO ===`);
//         console.log(`Sucessos: ${results.length}, Erros: ${errors.length}`);

//         // Salvar no localStorage se necessário
//         if (results.length > 0) {
//             await this.#saveToLocalStorage(results);
//         }

//         return { results, errors };
//     }

//     /**
//      * Salva resultados no localStorage
//      * @private
//      */
//     async #saveToLocalStorage(results) {
//         try {
//             const desejaSalvar = confirm("Deseja salvar os dados tratados no navegador?");

//             if (desejaSalvar) {
//                 const listaAtual = JSON.parse(localStorage.getItem("productList")) || [];

//                 const novosProdutos = results.flatMap((r) => {
//                     const data = r.data;
//                     return [
//                         ...(data?.savedProducts || []),
//                         ...(data?.updatedProducts?.map((p) => {
//                             const product = p.product;
//                             return {
//                                 description: product.description,
//                                 reference: product.reference,
//                                 fashionStyle: product.fashionStyle,
//                                 sizes: product.sizes,
//                                 colors: product.colors,
//                                 price: product.price,
//                             };
//                         }) || []),
//                     ];
//                 });

//                 const novaLista = novosProdutos.concat(listaAtual);
//                 localStorage.setItem("productList", JSON.stringify(novaLista));

//                 this.showMessage("Dados adicionados ao localStorage com sucesso!", "success");
//             }
//         } catch (e) {
//             console.error("Erro ao salvar no localStorage:", e);
//             this.showMessage("Erro ao salvar os dados localmente.", "error");
//         }
//     }

//     /**
//      * Salva produto no banco
//      * @private
//      */
//     async #saveProduct(productData) {
//         try {
//             const validatedProduct = this.#validateProductData(productData);
//             console.log("Produto validado:", validatedProduct);

//             const savedProduct = await this.#saveProductToDatabase(validatedProduct);
//             return savedProduct;
//         } catch (error) {
//             console.error("Erro na validação do produto:", error.message);
//             throw error;
//         }
//     }

//     /**
//      * Processa um produto individual - VERSÃO CORRIGIDA
//      * @private
//      */
//     async #processIndividualProduct({ fashionStyle, reference, description, price }) {
//         console.log("DEBUG: Processando produto individual");
//         console.log("Referência:", reference);
//         console.log("Descrição:", description);

//         const refUpper = reference.toUpperCase();
//         const descUpper = description.toUpperCase();

//         if (refUpper.slice(-3) === descUpper.slice(-3)) {
//             await this.#processProductDetailed(fashionStyle, reference, description, price);
//         } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
//             await this.#processProductDetailed(fashionStyle, reference, description, price);
//         } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
//             await this.#processProductDetailed(fashionStyle, reference, description, price);
//         } else {
//              await this.#processProductSimple(fashionStyle, reference, description, price)
//         }
//     }

//     async #processProductSimple(fashionStyle, reference, description, price) {

//     }

//     async #processProductDetailed(fashionStyle, reference, description, price) {
//         // Verifica se é uma variação do produto atual
//         const isVariant =
//             this.currentProduct.reference && reference.includes(this.currentProduct.reference);

//         console.log("É variação do produto atual?", isVariant);

//         if (isVariant) {
//             console.log("Produto atual:", this.currentProduct);
//             // É uma variação - adiciona cor
//             console.log("Processando como variação");
//             this.#processProductVariant(reference, description);
//         } else {
//             // É um novo produto - salva o anterior e inicia novo
//             console.log("Processando como novo produto");
//             await this.#startNewProduct(fashionStyle, reference, description, price);
//         }
//     }

//     #processBaseReference(reference, description) {
//         console.log("vamos tirar a informação do tamanho da referencia:", reference);
//         const refUpper = reference.toUpperCase();
//         const descUpper = description.toUpperCase();

//         let referenceWithoutInfoSize;

//         if (refUpper.slice(-3) === descUpper.slice(-3)) {
//             referenceWithoutInfoSize = reference.slice(0, -3);
//         } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
//             referenceWithoutInfoSize = reference.slice(0, -2);
//         } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
//             referenceWithoutInfoSize = reference.slice(0, -1);
//         }

//         console.log("referencia sem informação do tamanho: ", referenceWithoutInfoSize);

//         console.log("vamos tirar a informação de cor da referencia: ", referenceWithoutInfoSize);
//         this.#addColorToCurrentProduct(
//             this.#extractColorCodeFromReference(referenceWithoutInfoSize)
//         );
//         const referenceBase = this.#removeColorCodeFromReference(referenceWithoutInfoSize);
//         console.log("referencia sem informação da cor: ", referenceBase);

//         return referenceBase;
//     }

//     /**
//      * Processa variante de produto (adiciona cor)
//      * @private
//      */
//     #processProductVariant(reference, description) {
//         console.log("DEBUG: Processando variante");
//         console.log("Referência completa:", reference);
//         console.log("Referência base atual:", this.currentProduct.reference);

//         const refUpper = reference.toUpperCase();
//         const descUpper = description.toUpperCase();

//         let referenceWithoutInfoSize;

//         if (refUpper.slice(-3) === descUpper.slice(-3)) {
//             referenceWithoutInfoSize = reference.slice(0, -3);
//         } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
//             referenceWithoutInfoSize = reference.slice(0, -2);
//         } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
//             referenceWithoutInfoSize = reference.slice(0, -1);
//         }

//         console.log("referencia sem informação do tamanho: ", referenceWithoutInfoSize);

//         console.log("vamos tirar a informação de cor da referencia: ", referenceWithoutInfoSize);
//         this.#addColorToCurrentProduct(
//             this.#extractColorCodeFromReference(referenceWithoutInfoSize)
//         );
//     }

//     #removeColorCodeFromReference(reference) {
//         const lastChar = reference.slice(-1);
//         const lastTwoChars = reference.slice(-2);
//         const isLastCharNumeric = !isNaN(Number(lastChar));
//         const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

//         if (isLastTwoCharsNumeric) {
//             return reference.slice(0, -4);
//         } else if (isLastCharNumeric) {
//             return reference.slice(0, -3);
//         } else {
//             return reference;
//         }
//     }

//     #extractColorCodeFromReference(reference) {
//         const lastChar = reference.slice(-1);
//         const lastTwoChars = reference.slice(-2);
//         const isLastCharNumeric = !isNaN(Number(lastChar));
//         const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

//         let colorCode;

//         if (isLastTwoCharsNumeric) {
//             colorCode = reference.slice(-4);
//         } else if (isLastCharNumeric) {
//             colorCode = reference.slice(-3);
//         } else {
//             colorCode = "";
//         }

//         return colorCode === ProductProcessor.SORTED_REFERENCE_CODE
//             ? ProductProcessor.SORTED_CODE
//             : colorCode;
//     }

//     /**
//      * Adiciona cor ao produto atual
//      * @private
//      */
//     #addColorToCurrentProduct(colorCode) {
//         console.log("DEBUG: Adicionando cor ao produto atual");
//         console.log("Código de cor:", colorCode);
//         console.log("Cores atuais:", this.currentProduct.colors);

//         if (colorCode === ProductProcessor.SORTED_CODE) {
//             this.currentProduct.colors = ProductProcessor.SORTED_CODE;
//         } else if (Array.isArray(this.currentProduct.colors)) {
//             if (!this.currentProduct.colors.includes(colorCode)) {
//                 this.currentProduct.colors.push(colorCode);
//             }
//         } else {
//             this.currentProduct.colors = [colorCode];
//         }

//         console.log("Cores após adição:", this.currentProduct.colors);
//     }

//     /**
//      * Inicia um novo produto
//      * @private
//      */
//     async #startNewProduct(fashionStyle, reference, description, price) {
//         console.log("DEBUG: Iniciando novo produto");
//         console.log("Vamos iniciar um novo produto: ", fashionStyle, reference, description, price);

//         // Salva produto anterior se existir
//         if (this.currentProduct.reference) {
//             try {
//                 console.log("Salvando produto anterior:", this.currentProduct);
//                 const savedProduct = await this.#saveProduct({ ...this.currentProduct });
//                 this.processingResults.push(savedProduct);
//                 console.log("Produto anterior salvo com sucesso");
//             } catch (error) {
//                 console.error("Erro ao salvar produto anterior:", error.message);
//                 throw error;
//             }
//         }

//         // Inicializa novo produto
//         // Cria o esqueleto inicial do produto
//         this.currentProduct = {
//             fashionStyle,
//             reference: "", // preenchido depois
//             sizes: this.#extractSizes(description),
//             description: "",
//             colors: [],
//             price,
//         };

//         // Agora que this.currentProduct existe, você pode adicionar cor com segurança
//         this.currentProduct.reference = this.#processBaseReference(reference, description);
//         this.currentProduct.description = this.#cleanDescription(description);
//         this.#removeSizeInfoDescription();
//         console.log("Novo produto inicializado:", this.currentProduct);
//     }

//     /**
//      * Remove palavras de cores da descrição
//      * @private
//      */
//     #removeColorWordsFromDescription(description) {
//         if (!description || typeof description !== "string") return description;

//         const descUpper = description.toUpperCase();
//         const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA"];

//         // Verifica se deve manter as cores na descrição
//         const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
//             descUpper.startsWith(product)
//         );
//         if (shouldKeepColor) return description;

//         let newDescription = description;

//         // Remove cor no início da descrição, se existir
//         for (const color of ProductProcessor.COLOR_WORDS) {
//             const regexStart = new RegExp(`^${color}\\s*`, "i");
//             if (regexStart.test(newDescription)) {
//                 newDescription = newDescription.replace(regexStart, "").trim();
//                 break;
//             }
//         }

//         // Remove qualquer cor no meio ou fim da descrição
//         const descUpperAfterStart = newDescription.toUpperCase();
//         let earliestColorIndex = -1;
//         for (const color of ProductProcessor.COLOR_WORDS) {
//             const index = descUpperAfterStart.indexOf(color);
//             if (index !== -1 && (earliestColorIndex === -1 || index < earliestColorIndex)) {
//                 earliestColorIndex = index;
//             }
//         }

//         if (earliestColorIndex !== -1) {
//             newDescription = newDescription.slice(0, earliestColorIndex).trim();
//         }

//         return newDescription;
//     }

//     /**
//      * Limpa descrição removendo elementos desnecessários
//      * @private
//      */
//     #cleanDescription(description) {
//         if (!description || typeof description !== "string") {
//             return description || "";
//         }

//         console.log("DEBUG: cleanDescription - entrada:", description);

//         // Remove códigos específicos
//         const cleaned = description
//             .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
//             .replace(ProductProcessor.UNIT_PATTERNS, "")
//             .trim();

//         console.log("DEBUG: cleanDescription - após limpeza básica:", cleaned);

//         // Remove cores
//         const withoutColors = this.#removeColorWordsFromDescription(cleaned);
//         console.log("DEBUG: cleanDescription - após remoção de cores:", withoutColors);

//         // Remove códigos numéricos no final
//         const withoutEndCodes = withoutColors.replace(/\s+\d{3,}\w*$/g, "").trim();
//         console.log("DEBUG: cleanDescription - resultado final:", withoutEndCodes);

//         return withoutEndCodes;
//     }

//     #removeSizeInfoDescription() {
//         if (this.currentProduct.sizes === ProductProcessor.DEFAULT_SIZE) return;

//         console.log("ultima limpeza da descrição");

//         const sizeIndex = this.currentProduct.description
//             .toUpperCase()
//             .indexOf(this.currentProduct.sizes);

//         if (sizeIndex !== -1) {
//             this.currentProduct.description = this.currentProduct.description
//                 .slice(0, sizeIndex)
//                 .trim();
//         }

//         // Correção específica para " AO GG"
//         if (this.currentProduct.sizes === " AO GG") {
//             this.currentProduct.sizes = "P AO GG";
//         }
//     }

//     /**
//      * Extrai informações de tamanho da descrição
//      * @private
//      */
//     #extractSizes(description) {
//         if (!description) return ProductProcessor.DEFAULT_SIZE;

//         const normalizedDescription = description.toUpperCase();

//         for (const size of ProductProcessor.SIZE_PATTERNS) {
//             if (normalizedDescription.includes(size)) {
//                 return size === " AO GG" ? "P AO GG" : size;
//             }
//         }

//         return ProductProcessor.DEFAULT_SIZE;
//     }
// }

// /**
//  * Factory para criar instância do ProductProcessor
//  */
// class ProductProcessorFactory {
//     static create(apiBaseUrl) {
//         return new ProductProcessor(apiBaseUrl);
//     }
// }

// // Inicialização
// document.addEventListener("DOMContentLoaded", () => {
//     try {
//         const productProcessor = ProductProcessorFactory.create(
//             "http://localhost:3000/api/description"
//         );

//         // Disponibiliza globalmente para debug
//         window.productProcessor = productProcessor;

//         console.log("ProductProcessor inicializado com sucesso");
//     } catch (error) {
//         console.error("Erro ao inicializar ProductProcessor:", error);
//     }
// });

// // Export para uso em módulos
// if (typeof module !== "undefined" && module.exports) {
//     module.exports = { ProductProcessor, ProductProcessorFactory };
// }

/**
 * Processador de formatação de produtos para banco de dados
 * Processa dados CSV de produtos e envia para o banco
 */
class ProductProcessor {
    // Constantes da classe
    static SIZE_PATTERNS = [
        "P AO GG",
        " AO GG",
        "P AO G",
        "P AO XGG",
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
        "40 AO 46",
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
                    "warning"
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
                throw new Error(
                    `Formato inválido na linha ${index + 1} - esperado pelo menos 3 colunas`
                );
            }

            const fashionStyle = this.#extractFashionStyle(columns[0]);
            const { reference, description } = this.#parseSecondColumn(columns[1]);
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
            price: this.parsePrice(productData.price),
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
    #extractFashionStyle(sectionPath) {
        if (!sectionPath || typeof sectionPath !== "string") {
            return "";
        }

        const match = sectionPath.match(/ *- */);
        const firstHyphenIndex = match ? match.index : -1;
        const hyphenLength = match ? match[0].length : 0;

        if (firstHyphenIndex === -1) {
            return "";
        }

        const afterFirstHyphen = sectionPath.slice(firstHyphenIndex + hyphenLength).trimStart();
        const firstDotOrSpaceIndex = afterFirstHyphen.search(/[. ]/);

        if (firstDotOrSpaceIndex === -1) {
            return afterFirstHyphen;
        }

        return afterFirstHyphen.slice(0, firstDotOrSpaceIndex).trim();
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
        if (priceString === null || priceString === undefined) return 0; // Adicionado null/undefined check

        const cleanPrice = priceString.toString().trim().replace(",", ".");
        const parsed = parseFloat(cleanPrice);

        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    }

    /**
     * Processa todos os produtos
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

        // CORREÇÃO PRINCIPAL: Finaliza o último produto se existir e não foi salvo
        if (this.currentProduct.reference) {
            try {
                console.log("\n=== FINALIZANDO ÚLTIMO PRODUTO ===");
                console.log("Produto atual (para salvar):", this.currentProduct);

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

        // Adiciona produtos salvos durante o processamento (já foram adicionados em #startNewProduct)
        results.push(...this.processingResults);

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
            console.error("Erro na validação/salvamento do produto:", error.message);
            throw error;
        }
    }

    /**
     * Processa um produto individual
     * Decide se é um novo produto ou uma variação do produto atual.
     * @private
     * @param {Object} product - Dados do produto do CSV
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
     * Processa um produto detalhado (sempre uma variação ou o primeiro item de um grupo)
     * @private
     */
    async #processProductDetailed(fashionStyle, reference, description, price) {
        // Esta função não é mais usada diretamente como um ponto de decisão.
        // Sua lógica foi integrada em #processIndividualProduct e #startNewProduct
        // para maior clareza de fluxo.
        // Mantida aqui por compatibilidade ou para futura refatoração menor se houver um caso de uso distinto.
        console.warn(
            "#processProductDetailed foi chamada. Considere refatorar o fluxo de chamada."
        );
        const isVariant =
            this.currentProduct.reference && reference.includes(this.currentProduct.reference);

        if (isVariant) {
            this.#processProductVariant(reference, description);
        } else {
            await this.#startNewProduct(fashionStyle, reference, description, price);
        }
    }

    /**
     * Extrai a referência base do produto, removendo info de tamanho e cor, e adiciona a cor ao currentProduct.
     * @private
     * @param {string} reference - A referência completa do produto.
     * @param {string} description - A descrição completa do produto.
     * @returns {string} A referência base sem informações de tamanho e cor.
     */
    // #processBaseReference(reference, description) {
    //     const normalizedDescription = description.toUpperCase();

    //     for (const size of ProductProcessor.SIZE_PATTERNS) {
    //         if (!normalizedDescription.includes(size)) {
    //            return
    //         }
    //     }

    //     console.log(
    //         "DEBUG: #processBaseReference - entrada: ref=",
    //         reference,
    //         "desc=",
    //         description
    //     );
    //     const refUpper = reference.toUpperCase();
    //     const descUpper = description.toUpperCase();

    //     let referenceWithoutInfoSize = reference;

    //     // Tenta remover o sufixo de tamanho da referência baseado na descrição
    //     if (descUpper.length >= 3 && refUpper.endsWith(descUpper.slice(-3))) {
    //         referenceWithoutInfoSize = reference.slice(0, -3);
    //     } else if (descUpper.length >= 2 && refUpper.endsWith(descUpper.slice(-2))) {
    //         referenceWithoutInfoSize = reference.slice(0, -2);
    //     } else if (descUpper.length >= 1 && refUpper.endsWith(descUpper.slice(-1))) {
    //         referenceWithoutInfoSize = reference.slice(0, -1);
    //     }
    //     // Se nenhum padrão acima, 'referenceWithoutInfoSize' permanece o original

    //     console.log("DEBUG: ref sem informação do tamanho:", referenceWithoutInfoSize);

    //     // Extrai o código da cor e adiciona ao currentProduct
    //     const colorCode = this.#extractColorCodeFromReference(referenceWithoutInfoSize);
    //     if (colorCode) {
    //         // Só adiciona se um código de cor foi extraído
    //         this.#addColorToCurrentProduct(colorCode);
    //     }

    //     // Remove o código de cor da referência para obter a referência base final
    //     const referenceBase = this.#removeColorCodeFromReference(referenceWithoutInfoSize);
    //     console.log("DEBUG: referencia base (sem tamanho e cor):", referenceBase);

    //     return referenceBase;
    // }

    #processBaseReference(reference, description) {
        const normalizedDescription = description.toUpperCase();

        // Se a descrição NÃO contiver nenhum padrão de tamanho, retorna a referência original
        const hasKnownSize = ProductProcessor.SIZE_PATTERNS.some((size) =>
            normalizedDescription.includes(size)
        );

        if (!hasKnownSize) {
            return reference;
        }

        console.log(
            "DEBUG: #processBaseReference - entrada: ref=",
            reference,
            "desc=",
            description
        );

        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        let referenceWithoutInfoSize = reference;

        // Tenta remover sufixo de tamanho da referência baseado na descrição
        if (descUpper.length >= 3 && refUpper.endsWith(descUpper.slice(-3))) {
            referenceWithoutInfoSize = reference.slice(0, -3);
        } else if (descUpper.length >= 2 && refUpper.endsWith(descUpper.slice(-2))) {
            referenceWithoutInfoSize = reference.slice(0, -2);
        } else if (descUpper.length >= 1 && refUpper.endsWith(descUpper.slice(-1))) {
            referenceWithoutInfoSize = reference.slice(0, -1);
        }

        console.log("DEBUG: ref sem informação do tamanho:", referenceWithoutInfoSize);

        // Extrai o código da cor e adiciona ao currentProduct
        const colorCode = this.#extractColorCodeFromReference(referenceWithoutInfoSize);
        if (colorCode) {
            this.#addColorToCurrentProduct(colorCode);
        }

        // Remove o código de cor da referência para obter a base final
        const referenceBase = this.#removeColorCodeFromReference(referenceWithoutInfoSize);
        console.log("DEBUG: referencia base (sem tamanho e cor):", referenceBase);

        return referenceBase;
    }

    #removeInfoSizeFromReferenceFromVariante(reference, description) {
        console.log(
            "DEBUG: #removeInfoSizeFromReferenceFromVariante - entrada: ref=",
            reference,
            "desc=",
            description
        );
        const refUpper = reference.toUpperCase();
        const descUpper = description.toUpperCase();

        let referenceWithoutInfoSize = reference;

        // Tenta remover o sufixo de tamanho da referência baseado na descrição
        if (descUpper.length >= 3 && refUpper.endsWith(descUpper.slice(-3))) {
            referenceWithoutInfoSize = reference.slice(0, -3);
        } else if (descUpper.length >= 2 && refUpper.endsWith(descUpper.slice(-2))) {
            referenceWithoutInfoSize = reference.slice(0, -2);
        } else if (descUpper.length >= 1 && refUpper.endsWith(descUpper.slice(-1))) {
            referenceWithoutInfoSize = reference.slice(0, -1);
        }

        const colorCode = this.#extractColorCodeFromReference(referenceWithoutInfoSize);

        return colorCode;
    }

    /**
     * Processa uma variação de produto (apenas adiciona a cor).
     * @private
     * @param {string} reference - A referência completa da variação.
     * @param {string} description - A descrição completa da variação.
     */
    #processProductVariant(reference, description) {
        console.log("DEBUG: Processando como variação");
        console.log("Referência completa da variação:", reference);

        // Extrai a cor da referência da variação e adiciona
        const colorCode = this.#removeInfoSizeFromReferenceFromVariante(reference, description);
        if (colorCode) {
            this.#addColorToCurrentProduct(colorCode);
        }
        // A descrição e o preço não são atualizados para variações, apenas as cores.
    }

    /**
     * Remove o código de cor da referência (parte numérica ou SO1).
     * @param {string} reference - A referência com possível código de cor.
     * @returns {string} A referência sem o código de cor.
     * @private
     */
    #removeColorCodeFromReference(reference) {
        if (!reference || typeof reference !== "string") return reference;

        // Se a referência termina com SO1 (SORTIDO), remove
        if (reference.endsWith(ProductProcessor.SORTED_REFERENCE_CODE)) {
            return reference.slice(0, -ProductProcessor.SORTED_REFERENCE_CODE.length).trim();
        }

        const lastChar = reference.slice(-1);
        const lastTwoChars = reference.slice(-2);
        const isLastCharNumeric = !isNaN(Number(lastChar));
        const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

        if (isLastTwoCharsNumeric) {
            return reference.slice(0, -4);
        } else if (isLastCharNumeric) {
            return reference.slice(0, -3);
        } else {
            return reference; // Retorna original se nenhum padrão for encontrado
        }
    }

    /**
     * Extrai o código de cor de uma referência.
     * @param {string} reference - A referência para extrair o código de cor.
     * @returns {string} O código de cor (ou SORTED_CODE se for SO1), ou uma string vazia.
     * @private
     */
    // #extractColorCodeFromReference(reference) {
    //     if (!reference || typeof reference !== "string") return "";

    //     // Verifica se é o código de "SORTIDO"
    //     if (reference.endsWith(ProductProcessor.SORTED_REFERENCE_CODE)) {
    //         return ProductProcessor.SORTED_CODE;
    //     }

    //     // Tenta extrair o código numérico da cor
    //     const colorCodeRegex = /[-_]?(\d{1,3})$/; // Ex: -01, _10, 123
    //     const match = reference.match(colorCodeRegex);

    //     if (match && match[1]) {
    //         return match[1]; // Retorna apenas o grupo de captura do número
    //     }

    //     return ""; // Retorna vazio se nenhum código de cor for encontrado
    // }

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
    // #addColorToCurrentProduct(colorCode) {
    //     console.log("DEBUG: Adicionando cor ao produto atual");
    //     console.log("Código de cor a adicionar:", colorCode);
    //     console.log("Cores atuais antes:", this.currentProduct.colors);

    //     if (colorCode === ProductProcessor.SORTED_CODE) {
    //         this.currentProduct.colors = ProductProcessor.SORTED_CODE;
    //     } else if (Array.isArray(this.currentProduct.colors)) {
    //         if (colorCode && !this.currentProduct.colors.includes(colorCode)) {
    //             // Garante que colorCode não é vazio e não duplicado
    //             this.currentProduct.colors.push(colorCode);
    //         }
    //     } else {
    //         // Se currentProduct.colors não é um array (ex: se já foi "SORTIDO")
    //         this.currentProduct.colors = [colorCode];
    //     }

    //     console.log("Cores após adição:", this.currentProduct.colors);
    // }

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
     * Inicia um novo produto. Salva o produto anterior se existir.
     * @private
     */
    async #startNewProduct(fashionStyle, reference, description, price) {
        console.log("DEBUG: #startNewProduct - Iniciando um NOVO produto.");

        // Salva o produto anterior se ele existe e tem uma referência (ou seja, não é o produto vazio inicial)
        if (this.currentProduct.reference) {
            try {
                console.log(
                    "Salvando produto anterior antes de iniciar um novo:",
                    this.currentProduct
                );
                const savedProduct = await this.#saveProduct({ ...this.currentProduct });
                this.processingResults.push(savedProduct); // Armazena o resultado de sucesso
                console.log("Produto anterior salvo com sucesso.");
            } catch (error) {
                console.error(
                    "Erro ao salvar produto anterior. Prosseguindo com o próximo...",
                    error.message
                );
                // Permite que o processamento continue mesmo que o anterior falhe
                // O erro já é registrado em #processProducts
            }
        }
        this.currentProduct = null; // previne resíduos do produto anterior

        // Extrai informações para o NOVO produto
        const sizes = this.#extractSizes(description);
        const referenceBase = this.#processBaseReference(reference, description); // Extrai cor e ref base
        const cleanedDescription = this.#cleanDescription(description);


        // Inicializa o novo produto
        this.currentProduct = {
            fashionStyle,
            reference: referenceBase,
            sizes,
            description: cleanedDescription,
            colors: [ProductProcessor.SORTED_CODE], // sempre começa limpo
            price,
        };

        // this.currentProduct = {
        //     fashionStyle,
        //     reference: referenceBase,
        //     sizes,
        //     description: cleanedDescription,
        //     colors: [],
        //     price,
        // };

        this.#removeSizeInfoDescription(); // Limpeza final da descrição baseada no tamanho extraído

        console.log("Novo produto inicializado:", this.currentProduct);
    }

    /**
     * Remove palavras de cores da descrição
     * @private
     */
    #removeColorWordsFromDescription(description) {
        if (!description || typeof description !== "string") return description;

        const descUpper = description.toUpperCase();
        const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA"];

        // Verifica se deve manter as cores na descrição
        const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
            descUpper.startsWith(product)
        );
        if (shouldKeepColor) return description;

        let newDescription = description;

        // Remove cor no início da descrição, se existir
        for (const color of ProductProcessor.COLOR_WORDS) {
            // Usa word boundary para evitar remover partes de palavras (ex: "AZUL" de "BLUSA AZULADA")
            const regexStart = new RegExp(`^${color}\\b\\s*`, "i");
            if (regexStart.test(newDescription)) {
                newDescription = newDescription.replace(regexStart, "").trim();
                break;
            }
        }

        // Remove qualquer cor no meio ou fim da descrição
        let earliestColorIndex = -1;
        let lastFoundColorLength = 0; // Para remover a palavra completa
        for (const color of ProductProcessor.COLOR_WORDS) {
            // Usa word boundary para evitar remover partes de palavras
            const regexGlobal = new RegExp(`\\b${color}\\b`, "i");
            const match = newDescription.match(regexGlobal);

            if (match) {
                const index = newDescription.indexOf(match[0]); // Pega o índice da palavra real (com case)
                if (index !== -1 && (earliestColorIndex === -1 || index < earliestColorIndex)) {
                    earliestColorIndex = index;
                    lastFoundColorLength = match[0].length;
                }
            }
        }

        if (earliestColorIndex !== -1) {
            // Remove a palavra da cor, mantendo o que vem antes
            newDescription =
                newDescription.slice(0, earliestColorIndex) +
                newDescription.slice(earliestColorIndex + lastFoundColorLength);
            newDescription = newDescription.trim(); // Limpa espaços extras
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

        console.log("DEBUG: #cleanDescription - entrada:", description);

        // Remove códigos específicos (SORTIDOU, SORTIDO, SORTIMENTO, unidades)
        let cleaned = description
            .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
            .replace(ProductProcessor.UNIT_PATTERNS, "")
            .trim();

        console.log("DEBUG: #cleanDescription - após limpeza básica:", cleaned);

        // Remove cores
        const withoutColors = this.#removeColorWordsFromDescription(cleaned);
        console.log("DEBUG: #cleanDescription - após remoção de cores:", withoutColors);

        // Remove códigos numéricos no final (ex: "PRODUTO 12345" -> "PRODUTO")
        const withoutEndCodes = withoutColors.replace(/\s+\d{3,}\w*$/g, "").trim();
        console.log("DEBUG: #cleanDescription - resultado final:", withoutEndCodes);

        return withoutEndCodes;
    }

    /**
     * Remove informações de tamanho da descrição do currentProduct, se o tamanho foi extraído.
     * @private
     */
    #removeSizeInfoDescription() {
        // Se o tamanho é "ÚNICO", não há informação de tamanho explícita para remover.
        if (
            !this.currentProduct.sizes ||
            this.currentProduct.sizes === ProductProcessor.DEFAULT_SIZE
        ) {
            return;
        }

        console.log("DEBUG: #removeSizeInfoDescription - Limpando info de tamanho da descrição...");
        console.log("Descrição atual:", this.currentProduct.description);
        console.log("Tamanho a remover:", this.currentProduct.sizes);

        const descUpper = this.currentProduct.description.toUpperCase();
        const sizeUpper = this.currentProduct.sizes.toUpperCase();

        const sizeIndex = descUpper.indexOf(sizeUpper);

        if (sizeIndex !== -1) {
            // Remove a parte da descrição que contém o tamanho
            this.currentProduct.description = this.currentProduct.description
                .slice(0, sizeIndex)
                .trim();
        }

        // Correção específica para " AO GG" (que vira "P AO GG" no sistema)
        if (this.currentProduct.sizes === " AO GG") {
            this.currentProduct.sizes = "P AO GG";
        }

        console.log("DEBUG: Descrição após remoção de tamanho:", this.currentProduct.description);
    }

    /**
     * Extrai informações de tamanho da descrição
     * @private
     */
    #extractSizes(description) {
        if (!description || typeof description !== "string") return ProductProcessor.DEFAULT_SIZE;

        const normalizedDescription = description.toUpperCase();

        for (const size of ProductProcessor.SIZE_PATTERNS) {
            if (normalizedDescription.includes(size)) {
                return size === " AO GG" ? "P AO GG" : size;
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
            "http://localhost:3000/api/description"
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
