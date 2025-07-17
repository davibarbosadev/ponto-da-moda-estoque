// // /**
// //  * Processador de formatação de produtos para banco de dados
// //  * Processa dados CSV de produtos e envia para o banco
// //  */
// // class ProductProcessor {
// //     // Constantes da classe
// //     static SIZE_PATTERNS = [
// //         "P AO GG",
// //         " AO GG",
// //         "P AO G",
// //         "P AO XGG",
// //         "G1 AO G3",
// //         "1 AO 3",
// //         "1 AO 10",
// //         "4 AO 8",
// //         "4 AO 10",
// //         "4 AO 12",
// //         "4 AO 14",
// //         "4 AO 16",
// //         "10 AO 14",
// //         "10 AO 16",
// //         "12 AO 16",
// //         "36 AO 44",
// //         "36 AO 46",
// //         "36 AO 48",
// //         "36 AO 52",
// //         "38 AO 46",
// //         "38 AO 48",
// //         "40 AO 46",
// //         "46 AO 50",
// //         "46 AO 52",
// //         "48 AO 52",
// //         "48 AO 54",
// //     ];

// //     static COLOR_WORDS = [
// //         "BEGE",
// //         "AZUL",
// //         "MARINHO",
// //         "ROSA",
// //         "VERMELHO",
// //         "PRETO",
// //         "BRANCO",
// //         "AMARELO",
// //         "VERDE",
// //         "LILÁS",
// //         "CINZA",
// //         "VINHO",
// //         "OFF",
// //         "LARANJA",
// //         "ROXO",
// //         "NUDE",
// //         "MARROM",
// //         "AREIA",
// //     ];

// //     static UNIT_PATTERNS = /\s?\((un|pç|pc|cj|par)\)/i;
// //     static SORTED_CODE = "SORTIDO";
// //     static SORTED_REFERENCE_CODE = "SO1";
// //     static DEFAULT_SIZE = "ÚNICO";

// //     constructor(apiBaseUrl = "/api/description") {
// //         this.apiBaseUrl = apiBaseUrl;
// //         this.currentProduct = this.#createEmptyProduct();
// //         this.#initializeForm();
// //         this.#createMessageElement();
// //     }

// //     /**
// //      * Cria o elemento de mensagem se não existir
// //      * @private
// //      */
// //     #createMessageElement() {
// //         if (!document.querySelector(".message-display")) {
// //             const messageElement = document.createElement("div");
// //             messageElement.className = "message-display";

// //             Object.assign(messageElement.style, {
// //                 position: "fixed",
// //                 top: "20px",
// //                 right: "20px",
// //                 padding: "12px 20px",
// //                 borderRadius: "4px",
// //                 fontSize: "14px",
// //                 fontWeight: "500",
// //                 zIndex: "9999",
// //                 maxWidth: "400px",
// //                 opacity: "0",
// //                 transform: "translateX(100%)",
// //                 transition: "all 0.3s ease-in-out",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
// //             });

// //             const style = document.createElement("style");
// //             style.textContent = `
// //                     .message-display.open {
// //                         opacity: 1 !important;
// //                         transform: translateX(0) !important;
// //                     }
// //                 `;
// //             document.head.appendChild(style);

// //             document.body.appendChild(messageElement);
// //         }
// //     }

// //     /**
// //      * Exibe mensagem para o usuário
// //      * @param {string} message - Mensagem a ser exibida
// //      * @param {string} type - Tipo da mensagem (success, error, warning, info)
// //      */
// //     showMessage(message, type = "info") {
// //         let messageElement = document.querySelector(".message-display");

// //         if (!messageElement) {
// //             this.#createMessageElement();
// //             messageElement = document.querySelector(".message-display");
// //         }

// //         const styles = {
// //             success: { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
// //             error: { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
// //             warning: { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" },
// //             info: { backgroundColor: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" },
// //         };

// //         const style = styles[type] || styles.info;
// //         Object.assign(messageElement.style, style);

// //         messageElement.textContent = message;
// //         messageElement.classList.add("open");

// //         setTimeout(() => {
// //             messageElement.classList.remove("open");
// //         }, 3000);
// //     }

// //     /**
// //      * Inicializa o formulário e adiciona event listeners
// //      * @private
// //      */
// //     #initializeForm() {
// //         const form = document.querySelector(".form--formate-product-description");
// //         if (!form) {
// //             console.error("Formulário não encontrado");
// //             this.showMessage("Erro: Formulário não encontrado", "error");
// //             return;
// //         }

// //         form.addEventListener("submit", this.#handleFormSubmit.bind(this));
// //     }

// //     /**
// //      * Manipula o submit do formulário - VERSÃO MELHORADA
// //      * @private
// //      */
// //     async #handleFormSubmit(event) {
// //         event.preventDefault();

// //         try {
// //             const csvData = event.target.csvInput?.value?.trim();

// //             if (!csvData) {
// //                 this.showMessage("Por favor, insira os dados CSV", "warning");
// //                 return;
// //             }

// //             const products = this.#parseCSVData(csvData);

// //             if (products.length === 0) {
// //                 this.showMessage("Nenhum produto válido encontrado nos dados CSV", "warning");
// //                 return;
// //             }

// //             this.showMessage("Processando produtos...", "info");

// //             const { results, errors } = await this.#processProducts(products);

// //             // Limpa o textarea após processamento
// //             event.target.csvInput.value = "";

// //             // Exibe resultado detalhado
// //             if (errors.length > 0) {
// //                 const errorDetails = errors
// //                     .map((err) => `Produto ${err.index}: ${err.error}`)
// //                     .join("\n");

// //                 console.error("Erros detalhados durante processamento:", errorDetails);

// //                 this.showMessage(
// //                     `${results.length} produto(s) salvos, ${errors.length} erro(s). Verifique o console para detalhes.`,
// //                     "warning"
// //                 );
// //             } else {
// //                 this.showMessage(`✓ ${results.length} produto(s) salvos no banco!`, "success");
// //             }
// //         } catch (error) {
// //             console.error("Erro ao processar produtos:", error.message);
// //             this.showMessage(`Erro ao processar produtos: ${error.message}`, "error");
// //         }
// //     }

// //     /**
// //      * Envia produto para o banco de dados - VERSÃO MELHORADA
// //      * @param {Object} productData - Dados do produto
// //      * @returns {Promise<Object>} Produto salvo
// //      * @private
// //      */
// //     async #saveProductToDatabase(productData) {
// //         try {
// //             // Log detalhado do produto antes de enviar
// //             console.log("Dados do produto a ser enviado:", JSON.stringify(productData, null, 2));

// //             const response = await fetch(this.apiBaseUrl, {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     "X-Requested-With": "XMLHttpRequest",
// //                 },
// //                 body: JSON.stringify(productData),
// //             });

// //             // Log da resposta
// //             console.log("Status da resposta:", response.status);

// //             const responseData = await response.json();
// //             console.log("Resposta da API:", responseData);

// //             if (!response.ok) {
// //                 // Extrai erros específicos da resposta
// //                 let errorMessage = responseData.message || `Erro HTTP: ${response.status}`;

// //                 // Se há erros específicos no array, inclui eles na mensagem
// //                 if (
// //                     responseData.errors &&
// //                     Array.isArray(responseData.errors) &&
// //                     responseData.errors.length > 0
// //                 ) {
// //                     const specificErrors = responseData.errors
// //                         .map((error) => {
// //                             if (typeof error === "string") {
// //                                 return error;
// //                             } else if (error.message) {
// //                                 return error.message;
// //                             } else if (error.field && error.error) {
// //                                 return `${error.field}: ${error.error}`;
// //                             } else {
// //                                 return JSON.stringify(error);
// //                             }
// //                         })
// //                         .join("; ");

// //                     errorMessage += ` - Detalhes: ${specificErrors}`;
// //                 }

// //                 console.error("Erro detalhado da API:", errorMessage);
// //                 throw new Error(errorMessage);
// //             }

// //             return responseData;
// //         } catch (error) {
// //             console.error("Erro ao salvar produto no banco:", error);
// //             throw error;
// //         }
// //     }

// //     /**
// //      * Cria um produto vazio com estrutura padrão
// //      * @private
// //      */
// //     #createEmptyProduct() {
// //         return {
// //             fashionStyle: "",
// //             description: "",
// //             reference: "",
// //             sizes: "",
// //             colors: [],
// //             price: 0,
// //         };
// //     }

// //     /**
// //      * Valida dados do produto antes de salvar - VERSÃO MELHORADA
// //      * @param {Object} productData - Dados do produto
// //      * @returns {Object} Produto validado
// //      * @private
// //      */
// //     // #validateProductData(productData) {
// //     //     const validated = {
// //     //         fashionStyle: (productData.fashionStyle || "").toString().trim(),
// //     //         description: (productData.description || "").toString().trim(),
// //     //         reference: (productData.reference || "").toString().trim(),
// //     //         sizes: (productData.sizes || ProductProcessor.DEFAULT_SIZE).toString().trim(),
// //     //         colors: Array.isArray(productData.colors)
// //     //             ? productData.colors
// //     //             : productData.colors === ProductProcessor.SORTED_CODE
// //     //             ? ProductProcessor.SORTED_CODE
// //     //             : [],
// //     //         price: this.parsePrice(productData.price),
// //     //     };

// //     //     // Validações específicas com mensagens mais detalhadas
// //     //     const errors = [];

// //     //     if (!validated.fashionStyle) {
// //     //         errors.push("Fashion style é obrigatório");
// //     //     }
// //     //     if (!validated.description) {
// //     //         errors.push("Descrição é obrigatória");
// //     //     }
// //     //     if (!validated.reference) {
// //     //         errors.push("Referência é obrigatória");
// //     //     }
// //     //     if (!validated.sizes) {
// //     //         validated.sizes = ProductProcessor.DEFAULT_SIZE;
// //     //     }
// //     //     if (
// //     //         !validated.colors ||
// //     //         (Array.isArray(validated.colors) && validated.colors.length === 0)
// //     //     ) {
// //     //         validated.colors = ProductProcessor.SORTED_CODE;
// //     //     }
// //     //     if (!validated.price || validated.price <= 0) {
// //     //         errors.push("Preço deve ser maior que zero");
// //     //     }

// //     //     // Se há erros de validação, lança exceção com todos os erros
// //     //     if (errors.length > 0) {
// //     //         throw new Error(`Erros de validação: ${errors.join("; ")}`);
// //     //     }

// //     //     // Log adicional para debug
// //     //     console.log("Produto validado com sucesso:", {
// //     //         fashionStyle: validated.fashionStyle,
// //     //         description: validated.description,
// //     //         reference: validated.reference,
// //     //         sizes: validated.sizes,
// //     //         colors: validated.colors,
// //     //         price: validated.price,
// //     //     });

// //     //     return validated;
// //     // }

// //     #validateProductData(productData) {
// //         console.log("DEBUG: validateProductData - entrada:", productData);

// //         const validated = {
// //             fashionStyle: (productData.fashionStyle || "").toString().trim(),
// //             description: (productData.description || "").toString().trim(),
// //             reference: (productData.reference || "").toString().trim(), // ⚠️ SEM PROCESSAMENTO ADICIONAL
// //             sizes: (productData.sizes || ProductProcessor.DEFAULT_SIZE).toString().trim(),
// //             colors: Array.isArray(productData.colors)
// //                 ? productData.colors
// //                 : productData.colors === ProductProcessor.SORTED_CODE
// //                 ? ProductProcessor.SORTED_CODE
// //                 : [],
// //             price: this.parsePrice(productData.price),
// //         };

// //         console.log("DEBUG: validateProductData - saída:", validated);

// //         // Validações sem alterar os dados
// //         const errors = [];
// //         if (!validated.fashionStyle) errors.push("Fashion style é obrigatório");
// //         if (!validated.description) errors.push("Descrição é obrigatória");
// //         if (!validated.reference) errors.push("Referência é obrigatória");
// //         if (!validated.price || validated.price <= 0) errors.push("Preço deve ser maior que zero");

// //         if (errors.length > 0) {
// //             throw new Error(`Erros de validação: ${errors.join("; ")}`);
// //         }

// //         return validated;
// //     }

// //     /**
// //      * Extrai o fashionStyle do produto a partir da estrutura hierárquica
// //      * @param {string} sectionPath - Caminho da seção
// //      * @returns {string} FashionStyle formatado
// //      * @private
// //      */
// //     #extractFashionStyle(sectionPath) {
// //         if (!sectionPath || typeof sectionPath !== "string") {
// //             return "";
// //         }

// //         const match = sectionPath.match(/ *- */);
// //         const firstHyphenIndex = match ? match.index : -1;
// //         const hyphenLength = match ? match[0].length : 0;

// //         if (firstHyphenIndex === -1) {
// //             return "";
// //         }

// //         const afterFirstHyphen = sectionPath.slice(firstHyphenIndex + hyphenLength).trimStart();
// //         const firstDotOrSpaceIndex = afterFirstHyphen.search(/[. ]/);

// //         if (firstDotOrSpaceIndex === -1) {
// //             return afterFirstHyphen;
// //         }

// //         return afterFirstHyphen.slice(0, firstDotOrSpaceIndex).trim();
// //     }

// //     /**
// //      * Remove números e códigos do início da descrição
// //      * @param {string} description - Descrição do produto
// //      * @returns {string} Descrição sem números/códigos iniciais
// //      * @private
// //      */
// //     #removeLeadingNumbers(description) {
// //         if (!description || typeof description !== "string") {
// //             return description;
// //         }

// //         return description
// //             .replace(/^\d+(-\d+\.\d+)?\s*/, "") // Remove números iniciais
// //             .replace(/^[A-Z]+\d+\s*/, "") // Remove códigos como "AF1381"
// //             .trim();
// //     }

// //     /**
// //      * Converte string de preço para número
// //      * @param {string|number} priceString - String do preço
// //      * @returns {number} Preço formatado
// //      */
// //     parsePrice(priceString) {
// //         if (!priceString && priceString !== 0) return 0;

// //         const cleanPrice = priceString.toString().trim().replace(",", ".");
// //         const parsed = parseFloat(cleanPrice);

// //         return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
// //     }

// //     /**
// //      * Faz parse dos dados CSV
// //      * @private
// //      */
// //     #parseCSVData(csvString) {
// //         const lines = csvString.trim().split("\n");

// //         return lines
// //             .map((line, index) => this.#parseCSVLine(line, index))
// //             .filter((product) => product !== null);
// //     }

// //     /**
// //      * Faz parse de uma linha CSV
// //      * @private
// //      */
// //     #parseCSVLine(line, index) {
// //         try {
// //             const columns = line.split(";").map((col) => col.replace(/"/g, "").trim());

// //             if (columns.length < 3) {
// //                 throw new Error(`Formato inválido - esperado pelo menos 3 colunas`);
// //             }

// //             const fashionStyle = this.#extractFashionStyle(columns[0]);
// //             const { reference, description } = this.#parseSecondColumn(columns[1]);
// //             const price = this.parsePrice(columns[2]);

// //             // Validação básica
// //             if (!fashionStyle || !reference || !description || !price) {
// //                 throw new Error(`Dados incompletos na linha ${index + 1}`);
// //             }

// //             return { fashionStyle, reference, description, price };
// //         } catch (error) {
// //             console.error(`Erro na linha ${index + 1}:`, error.message);
// //             return null;
// //         }
// //     }

// //     /**
// //      * Faz parse da segunda coluna (referência - descrição)
// //      * @private
// //      */
// //     #parseSecondColumn(secondColumn) {
// //         const parts = secondColumn.split(" - ");
// //         if (parts.length < 2) {
// //             throw new Error("Formato inválido - esperado 'referencia - descrição'");
// //         }

// //         let [reference, rawDescription] = parts.map((s) => s.trim());

// //         if (!reference || !rawDescription) {
// //             throw new Error("Referência ou descrição vazia");
// //         }

// //         rawDescription = this.#removeLeadingNumbers(rawDescription);
// //         const description = rawDescription.replace(ProductProcessor.UNIT_PATTERNS, "").trim();

// //         return { reference, description };
// //     }

// //     // /**
// //     //  * Processa todos os produtos - VERSÃO CORRIGIDA
// //     //  * @private
// //     //  */
// //     // async #processProducts(products) {
// //     //     const results = [];
// //     //     const errors = [];

// //     //     for (const [index, product] of products.entries()) {
// //     //         try {
// //     //             console.log(`Processando produto ${index + 1}/${products.length}:`, product);
// //     //             await this.#processIndividualProduct(product);
// //     //             // Não adiciona aqui pois pode processar múltiplas variações
// //     //         } catch (error) {
// //     //             console.error(`Erro ao processar produto ${index + 1}:`, error.message);
// //     //             errors.push({
// //     //                 product: product,
// //     //                 index: index + 1,
// //     //                 error: error.message,
// //     //             });
// //     //         }
// //     //     }

// //     //     // Finaliza o último produto se existir
// //     //     if (this.currentProduct.reference) {
// //     //         try {
// //     //             console.log("Finalizando último produto:", this.currentProduct);
// //     //             const savedProduct = await this.#saveProduct({ ...this.currentProduct });
// //     //             results.push(savedProduct);
// //     //             console.log("Último produto salvo com sucesso:", savedProduct);
// //     //         } catch (error) {
// //     //             console.error("Erro ao salvar último produto:", error.message);
// //     //             errors.push({
// //     //                 product: this.currentProduct,
// //     //                 index: "último",
// //     //                 error: error.message,
// //     //             });
// //     //         }
// //     //     }

// //     //     // Log final do processamento
// //     //     console.log(`Processamento finalizado: ${results.length} sucessos, ${errors.length} erros`);

// //     //     if (errors.length > 0) {
// //     //         console.log("Erros encontrados:", errors);
// //     //     }

// //     //     // ✅ NOVO BLOCO: salvar no localStorage

// //     //     if (results.length > 0) {
// //     //         const desejaSalvar = confirm("Deseja salvar os dados tratados no navegador?");

// //     //         if (desejaSalvar) {
// //     //             try {
// //     //                 const listaAtual = JSON.parse(localStorage.getItem("productList")) || [];

// //     //                 const novosProdutos = results.flatMap((r) => {
// //     //                     const data = r.data;
// //     //                     return [
// //     //                         ...(data?.savedProducts || []),
// //     //                         ...(data?.updatedProducts?.map((p) => {
// //     //                             const product = p.product;
// //     //                             return {
// //     //                                 description: product.description,
// //     //                                 reference: product.reference,
// //     //                                 fashionStyle: product.fashionStyle,
// //     //                                 sizes: product.sizes,
// //     //                                 colors: product.colors,
// //     //                                 price: product.price,
// //     //                             };
// //     //                         }) || []),
// //     //                     ];
// //     //                 });

// //     //                 const novaLista = novosProdutos.concat(listaAtual);

// //     //                 localStorage.setItem("productList", JSON.stringify(novaLista));

// //     //                 this.showMessage("Dados adicionados ao localStorage com sucesso!", "success");
// //     //             } catch (e) {
// //     //                 console.error("Erro ao salvar no localStorage:", e);
// //     //                 this.showMessage("Erro ao salvar os dados localmente.", "error");
// //     //             }
// //     //         }
// //     //     }

// //     //     // Retorna os resultados e erros normalmente
// //     //     return { results, errors };
// //     // }

// //     /**
// //      * Processa todos os produtos - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     async #processProducts(products) {
// //         const results = [];
// //         const errors = [];

// //         // ✅ INICIALIZA o array de resultados para coletar produtos salvos durante o processamento
// //         this.processingResults = [];

// //         for (const [index, product] of products.entries()) {
// //             try {
// //                 console.log(`Processando produto ${index + 1}/${products.length}:`, product);
// //                 await this.#processIndividualProduct(product);
// //             } catch (error) {
// //                 console.error(`Erro ao processar produto ${index + 1}:`, error.message);
// //                 errors.push({
// //                     product: product,
// //                     index: index + 1,
// //                     error: error.message,
// //                 });
// //             }
// //         }

// //         // ✅ ADICIONA produtos salvos durante o processamento
// //         results.push(...this.processingResults);

// //         // ✅ CORREÇÃO PRINCIPAL: Finaliza o último produto se existir
// //         if (this.currentProduct.reference) {
// //             try {
// //                 console.log("Finalizando último produto:", this.currentProduct);
// //                 const savedProduct = await this.#saveProduct({ ...this.currentProduct });
// //                 results.push(savedProduct);
// //                 console.log("Último produto salvo com sucesso:", savedProduct);
// //             } catch (error) {
// //                 console.error("Erro ao salvar último produto:", error.message);
// //                 errors.push({
// //                     product: this.currentProduct,
// //                     index: "último",
// //                     error: error.message,
// //                 });
// //             }
// //         }

// //         // ✅ LIMPA o array de resultados após o processamento
// //         this.processingResults = [];

// //         // Log final do processamento
// //         console.log(`Processamento finalizado: ${results.length} sucessos, ${errors.length} erros`);

// //         if (errors.length > 0) {
// //             console.log("Erros encontrados:", errors);
// //         }

// //         // ✅ CORREÇÃO ADICIONAL: Salvar no localStorage
// //         if (results.length > 0) {
// //             const desejaSalvar = confirm("Deseja salvar os dados tratados no navegador?");

// //             if (desejaSalvar) {
// //                 try {
// //                     const listaAtual = JSON.parse(localStorage.getItem("productList")) || [];

// //                     const novosProdutos = results.flatMap((r) => {
// //                         const data = r.data;
// //                         return [
// //                             ...(data?.savedProducts || []),
// //                             ...(data?.updatedProducts?.map((p) => {
// //                                 const product = p.product;
// //                                 return {
// //                                     description: product.description,
// //                                     reference: product.reference,
// //                                     fashionStyle: product.fashionStyle,
// //                                     sizes: product.sizes,
// //                                     colors: product.colors,
// //                                     price: product.price,
// //                                 };
// //                             }) || []),
// //                         ];
// //                     });

// //                     const novaLista = novosProdutos.concat(listaAtual);

// //                     localStorage.setItem("productList", JSON.stringify(novaLista));

// //                     this.showMessage("Dados adicionados ao localStorage com sucesso!", "success");
// //                 } catch (e) {
// //                     console.error("Erro ao salvar no localStorage:", e);
// //                     this.showMessage("Erro ao salvar os dados localmente.", "error");
// //                 }
// //             }
// //         }

// //         return { results, errors };
// //     }

// //     /**
// //      * Salva produto no banco
// //      * @private
// //      */
// //     async #saveProduct(productData) {
// //         try {
// //             const validatedProduct = this.#validateProductData(productData);

// //             console.log("Produto validado:", validatedProduct);

// //             const savedProduct = await this.#saveProductToDatabase(validatedProduct);
// //             return savedProduct;
// //         } catch (error) {
// //             console.error("Erro na validação do produto:", error.message);
// //             throw error;
// //         }
// //     }

// //     // /**
// //     //  * Processa um produto individual baseado na relação entre descrição e referência
// //     //  * @private
// //     //  */
// //     // async #processIndividualProduct({ fashionStyle, reference, description, price }) {
// //     //     const refUpper = reference.toUpperCase();
// //     //     const descUpper = description.toUpperCase();

// //     //     const processor = [1, 2, 3].some((len) => refUpper.slice(-len) === descUpper.slice(-len))
// //     //         ? this.#processLongReference.bind(this)
// //     //         : this.#processShortReference.bind(this);

// //     //     await processor(fashionStyle, reference, description, price);
// //     // }

// //     /**
// //      * Processa um produto individual - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     async #processIndividualProduct({ fashionStyle, reference, description, price }) {
// //         // ⚠️ IMPORTANTE: Nunca processar a referência como descrição
// //         console.log("DEBUG: Processando produto com referência:", reference);

// //         const refUpper = reference.toUpperCase();
// //         const descUpper = description.toUpperCase();

// //         // Verifica se a descrição contém algum padrão de tamanho
// //         const hasValidSizePattern = this.constructor.SIZE_PATTERNS.some((pattern) =>
// //             descUpper.includes(pattern)
// //         );

// //         // Só aplica a lógica de comparação de sufixos se houver padrão de tamanho válido
// //         const shouldUseLongReference =
// //             hasValidSizePattern &&
// //             [1, 2, 3].some((len) => refUpper.slice(-len) === descUpper.slice(-len));

// //         const processor = shouldUseLongReference
// //             ? this.#processLongReference.bind(this)
// //             : this.#processShortReference.bind(this);

// //         await processor(fashionStyle, reference, description, price);
// //     }

// //     /**
// //      * Processa referências longas (variações de produto)
// //      * @private
// //      */
// //     async #processLongReference(fashionStyle, reference, description, price) {
// //         const isVariant = this.#isVariantOfCurrentProduct(reference);

// //         if (isVariant) {
// //             this.#processProductVariant(reference, description);
// //         } else {
// //             await this.#startNewProduct(fashionStyle, reference, description, price);
// //         }
// //     }

// //     /**
// //      * Verifica se é uma variante do produto atual
// //      * @private
// //      */
// //     #isVariantOfCurrentProduct(reference) {
// //         return this.currentProduct.reference && reference.includes(this.currentProduct.reference);
// //     }

// //     /**
// //      * Processa variante de produto (adiciona cor)
// //      * @private
// //      */
// //     #processProductVariant(reference, description) {
// //         const cleanedReference = this.#removeMatchingSuffix(reference, description);
// //         const colorCode = this.#extractColorCode(cleanedReference);

// //         if (colorCode) {
// //             this.#addColorToCurrentProduct(colorCode);
// //         }
// //     }

// //     /**
// //      * Adiciona cor ao produto atual
// //      * @private
// //      */
// //     #addColorToCurrentProduct(colorCode) {
// //         if (colorCode === ProductProcessor.SORTED_CODE) {
// //             this.currentProduct.colors = ProductProcessor.SORTED_CODE;
// //         } else if (
// //             Array.isArray(this.currentProduct.colors) &&
// //             !this.currentProduct.colors.includes(colorCode)
// //         ) {
// //             this.currentProduct.colors.push(colorCode);
// //         }
// //     }

// //     // /**
// //     //  * Inicia um novo produto - VERSÃO CORRIGIDA
// //     //  * @private
// //     //  */
// //     // async #startNewProduct(fashionStyle, reference, description, price) {
// //     //     // Salva produto anterior se existir
// //     //     if (this.currentProduct.reference) {
// //     //         try {
// //     //             const savedProduct = await this.#saveProduct({ ...this.currentProduct });
// //     //             console.log("Produto anterior salvo:", savedProduct);
// //     //         } catch (error) {
// //     //             console.error("Erro ao salvar produto anterior:", error.message);

// //     //             // ✅ NÃO INTERROMPE O FLUXO - apenas loga o erro
// //     //             // O erro já será registrado no array de erros em #processProducts
// //     //             // Continua processando o próximo produto
// //     //         }
// //     //     }

// //     //     // Inicializa novo produto
// //     //     this.currentProduct = this.#createEmptyProduct();
// //     //     this.currentProduct.fashionStyle = fashionStyle;
// //     //     this.currentProduct.sizes = this.#extractSizes(description);
// //     //     this.currentProduct.price = price;
// //     //     this.currentProduct.description = this.#cleanDescription(description);

// //     //     this.#processNewProductReference(reference, description);
// //     //     this.#updateDescriptionWithSizes();
// //     // }

// //     /**
// //      * Inicia um novo produto - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     async #startNewProduct(fashionStyle, reference, description, price) {
// //         // ✅ CORREÇÃO: Criar array para armazenar produtos salvos durante o processamento
// //         if (!this.processingResults) {
// //             this.processingResults = [];
// //         }

// //         // Salva produto anterior se existir
// //         if (this.currentProduct.reference) {
// //             try {
// //                 const savedProduct = await this.#saveProduct({ ...this.currentProduct });
// //                 this.processingResults.push(savedProduct); // ✅ ADICIONA AO ARRAY DE RESULTADOS
// //                 console.log("Produto anterior salvo:", savedProduct);
// //             } catch (error) {
// //                 console.error("Erro ao salvar produto anterior:", error.message);
// //                 // ✅ NÃO INTERROMPE O FLUXO - apenas loga o erro
// //                 // O erro será tratado na função que chama este método
// //                 throw error; // ✅ IMPORTANTE: Re-lança o erro para ser capturado em processProducts
// //             }
// //         }

// //         // Inicializa novo produto
// //         this.currentProduct = this.#createEmptyProduct();
// //         this.currentProduct.fashionStyle = fashionStyle;
// //         this.currentProduct.sizes = this.#extractSizes(description);
// //         this.currentProduct.price = price;
// //         this.currentProduct.description = this.#cleanDescription(description);

// //         this.#processNewProductReference(reference, description);
// //         this.#updateDescriptionWithSizes();
// //     }

// //     /**
// //      * Processa referência do novo produto
// //      * @private
// //      */
// //     #processNewProductReference(reference, description) {
// //         const cleanedReference = this.#removeMatchingSuffix(reference, description);
// //         const colorCode = this.#extractColorCode(cleanedReference);

// //         if (colorCode) {
// //             this.#addColorToCurrentProduct(colorCode);
// //             this.currentProduct.reference = this.#removeColorCodeFromReference(cleanedReference);
// //         } else {
// //             this.currentProduct.reference = cleanedReference;
// //         }
// //     }

// //     // /**
// //     //  * Processa referências curtas
// //     //  * @private
// //     //  */
// //     // async #processShortReference(fashionStyle, reference, description, price) {
// //     //     const product = {
// //     //         fashionStyle,
// //     //         reference,
// //     //         description,
// //     //         price,
// //     //         sizes: ProductProcessor.DEFAULT_SIZE,
// //     //         colors: ProductProcessor.SORTED_CODE,
// //     //     };

// //     //     await this.#saveProduct(product);
// //     // }

// //     // CORREÇÃO 3: Garantir que #processShortReference preserve a referência
// //     /**
// //      * Processa referências curtas - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     async #processShortReference(fashionStyle, reference, description, price) {
// //         console.log("DEBUG: processShortReference - referência de entrada:", reference);

// //         // ✅ INICIALIZA o array de resultados se não existir
// //         if (!this.processingResults) {
// //             this.processingResults = [];
// //         }

// //         const product = {
// //             fashionStyle,
// //             reference, // ⚠️ MANTER EXATAMENTE COMO VEIO
// //             description: this.#cleanDescription(description),
// //             price,
// //             sizes: ProductProcessor.DEFAULT_SIZE,
// //             colors: ProductProcessor.SORTED_CODE,
// //         };

// //         console.log("DEBUG: processShortReference - produto criado:", product);

// //         // ✅ SALVA o produto e adiciona ao array de resultados
// //         const savedProduct = await this.#saveProduct(product);
// //         this.processingResults.push(savedProduct);

// //         console.log("DEBUG: processShortReference - produto salvo:", savedProduct);
// //     }

// //     /**
// //      * Remove sufixo correspondente entre referência e descrição
// //      * @private
// //      */
// //     #removeMatchingSuffix(reference, description) {
// //         const refUpper = reference.toUpperCase();
// //         const descUpper = description.toUpperCase();

// //         if (refUpper.slice(-3) === descUpper.slice(-3)) {
// //             return reference.slice(0, -3);
// //         } else if (refUpper.slice(-2) === descUpper.slice(-2)) {
// //             return reference.slice(0, -2);
// //         } else if (refUpper.slice(-1) === descUpper.slice(-1)) {
// //             return reference.slice(0, -1);
// //         }

// //         return reference;
// //     }

// //     /**
// //      * Extrai código de cor da referência
// //      * @private
// //      */
// //     #extractColorCode(reference) {
// //         const lastChar = reference.slice(-1);
// //         const lastTwoChars = reference.slice(-2);
// //         const isLastCharNumeric = !isNaN(Number(lastChar));
// //         const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

// //         let colorCode;

// //         if (isLastTwoCharsNumeric) {
// //             colorCode = reference.slice(-4);
// //         } else if (isLastCharNumeric) {
// //             colorCode = reference.slice(-3);
// //         } else {
// //             colorCode = "";
// //         }

// //         return colorCode === ProductProcessor.SORTED_REFERENCE_CODE
// //             ? ProductProcessor.SORTED_CODE
// //             : colorCode;
// //     }

// //     /**
// //      * Remove código de cor da referência
// //      * @private
// //      */
// //     #removeColorCodeFromReference(reference) {
// //         const lastChar = reference.slice(-1);
// //         const lastTwoChars = reference.slice(-2);
// //         const isLastCharNumeric = !isNaN(Number(lastChar));
// //         const isLastTwoCharsNumeric = !isNaN(Number(lastTwoChars));

// //         if (isLastTwoCharsNumeric) {
// //             return reference.slice(0, -4);
// //         } else if (isLastCharNumeric) {
// //             return reference.slice(0, -3);
// //         } else {
// //             return reference;
// //         }
// //     }

// //     /**
// //      * Remove palavras de cores da descrição
// //      * @private
// //      */
// //     // #removeColorWordsFromDescription(description) {
// //     //     const descUpper = description.toUpperCase();

// //     //     const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA"];

// //     //     const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
// //     //         descUpper.startsWith(product)
// //     //     );

// //     //     if (shouldKeepColor) {
// //     //         return description;
// //     //     }

// //     //     let minIndex = -1;
// //     //     let matchedColor = "";

// //     //     for (const color of ProductProcessor.COLOR_WORDS) {
// //     //         const index = descUpper.indexOf(color);
// //     //         if (index === 0) {
// //     //             matchedColor = color;
// //     //             break;
// //     //         }
// //     //     }

// //     //     let newDescription = description;

// //     //     if (matchedColor) {
// //     //         const regexStart = new RegExp(`^${matchedColor}\\s*`, "i");
// //     //         newDescription = newDescription.replace(regexStart, "").trim();
// //     //     }

// //     //     const newDescUpper = newDescription.toUpperCase();
// //     //     minIndex = -1;
// //     //     for (const color of ProductProcessor.COLOR_WORDS) {
// //     //         const index = newDescUpper.indexOf(color);
// //     //         if (index !== -1 && (minIndex === -1 || index < minIndex)) {
// //     //             minIndex = index;
// //     //         }
// //     //     }

// //     //     if (minIndex !== -1) {
// //     //         newDescription = newDescription.slice(0, minIndex).trim();
// //     //     }

// //     //     return newDescription;
// //     // }

// //     /**
// //      * Remove palavras de cores da descrição - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     #removeColorWordsFromDescription(description) {
// //         if (!description || typeof description !== "string") {
// //             return description;
// //         }

// //         const descUpper = description.toUpperCase();
// //         const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA"];

// //         // Verifica se deve manter cores
// //         const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
// //             descUpper.startsWith(product)
// //         );

// //         if (shouldKeepColor) {
// //             return description;
// //         }

// //         let newDescription = description;

// //         // CORREÇÃO: Busca apenas palavras COMPLETAS, não substrings
// //         for (const color of ProductProcessor.COLOR_WORDS) {
// //             // Padrão que busca a cor como palavra completa
// //             const wordBoundaryPattern = new RegExp(`\\b${color}\\b`, "gi");
// //             const matches = [...newDescription.matchAll(wordBoundaryPattern)];

// //             if (matches.length > 0) {
// //                 // Pega o primeiro match e remove tudo a partir dali
// //                 const firstMatch = matches[0];
// //                 newDescription = newDescription.slice(0, firstMatch.index).trim();
// //                 break;
// //             }
// //         }

// //         return newDescription;
// //     }

// //     // /**
// //     //  * Limpa descrição removendo elementos desnecessários
// //     //  * @private
// //     //  */
// //     // #cleanDescription(description) {
// //     //     if (!description) return "";

// //     //     const cleaned = description
// //     //         .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
// //     //         .replace(ProductProcessor.UNIT_PATTERNS, "")
// //     //         .trim();

// //     //     const withoutColors = this.#removeColorWordsFromDescription(cleaned);
// //     //     const withoutEndCodes = withoutColors.replace(/\s+\d{3,}\w*$/g, "").trim();

// //     //     return withoutEndCodes;
// //     // }

// //     /**
// //      * Limpa descrição removendo elementos desnecessários - VERSÃO CORRIGIDA
// //      * @private
// //      */
// //     #cleanDescription(description) {
// //         if (!description || typeof description !== "string") {
// //             return description || "";
// //         }

// //         console.log("DEBUG: cleanDescription - entrada:", description);

// //         // Passo 1: Remove códigos específicos
// //         const cleaned = description
// //             .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
// //             .replace(ProductProcessor.UNIT_PATTERNS, "")
// //             .trim();

// //         console.log("DEBUG: cleanDescription - após limpeza básica:", cleaned);

// //         // Passo 2: Remove cores (função corrigida)
// //         const withoutColors = this.#removeColorWordsFromDescription(cleaned);
// //         console.log("DEBUG: cleanDescription - após remoção de cores:", withoutColors);

// //         // Passo 3: Remove códigos numéricos no final
// //         const withoutEndCodes = withoutColors.replace(/\s+\d{3,}\w*$/g, "").trim();
// //         console.log("DEBUG: cleanDescription - resultado final:", withoutEndCodes);

// //         return withoutEndCodes;
// //     }

// //     /**
// //      * Atualiza descrição removendo informações de tamanho
// //      * @private
// //      */
// //     #updateDescriptionWithSizes() {
// //         if (this.currentProduct.sizes === ProductProcessor.DEFAULT_SIZE) return;

// //         const sizeIndex = this.currentProduct.description
// //             .toUpperCase()
// //             .indexOf(this.currentProduct.sizes);

// //         if (sizeIndex !== -1) {
// //             this.currentProduct.description = this.currentProduct.description
// //                 .slice(0, sizeIndex)
// //                 .trim();
// //         }

// //         if (this.currentProduct.sizes === " AO GG") {
// //             this.currentProduct.sizes = "P AO GG";
// //         }
// //     }

// //     /**
// //      * Extrai informações de tamanho da descrição
// //      * @private
// //      */
// //     #extractSizes(description) {
// //         if (!description) return ProductProcessor.DEFAULT_SIZE;

// //         const normalizedDescription = description.toUpperCase();

// //         for (const size of ProductProcessor.SIZE_PATTERNS) {
// //             if (normalizedDescription.includes(size)) {
// //                 return size;
// //             }
// //         }

// //         return ProductProcessor.DEFAULT_SIZE;
// //     }
// // }

// // /**
// //  * Factory para criar instância do ProductProcessor
// //  */
// // class ProductProcessorFactory {
// //     static create(apiBaseUrl) {
// //         return new ProductProcessor(apiBaseUrl);
// //     }
// // }

// // // Inicialização
// // document.addEventListener("DOMContentLoaded", () => {
// //     try {
// //         const productProcessor = ProductProcessorFactory.create(
// //             "http://localhost:3000/api/description"
// //         );

// //         // Disponibiliza globalmente para debug
// //         window.productProcessor = productProcessor;

// //         console.log("ProductProcessor inicializado com sucesso");
// //     } catch (error) {
// //         console.error("Erro ao inicializar ProductProcessor:", error);
// //     }
// // });

// // // Export para uso em módulos
// // if (typeof module !== "undefined" && module.exports) {
// //     module.exports = { ProductProcessor, ProductProcessorFactory };
// // }


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
        "SPLASH", // Adicionado para lidar com "SPLASH"
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

                if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
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
        if (!priceString && priceString !== 0) return 0;

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

            if (columns.length < 3) {
                throw new Error(`Formato inválido - esperado pelo menos 3 colunas`);
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
        console.log("Referência:", reference);
        console.log("Descrição:", description);

        // Extrai a referência base (sem sufixos de cor/tamanho)
        const baseReference = this.#extractBaseReference(reference);
        console.log("Referência base extraída:", baseReference);

        // Verifica se é uma variação do produto atual
        const isVariant = this.currentProduct.reference && 
                         this.currentProduct.reference === baseReference;

        console.log("É variação do produto atual?", isVariant);
        console.log("Produto atual:", this.currentProduct);

        if (isVariant) {
            // É uma variação - adiciona cor
            console.log("Processando como variação");
            this.#processProductVariant(reference, description);
        } else {
            // É um novo produto - salva o anterior e inicia novo
            console.log("Processando como novo produto");
            await this.#startNewProduct(fashionStyle, baseReference, description, price);
        }
    }

    /**
     * Extrai referência base removendo códigos de cor
     * @private
     */
    #extractBaseReference(reference) {
        // Remove códigos de cor do final da referência
        // Exemplo: CMD00533ROVSP2G -> CMD00533ROVSP2
        const colorCodePattern = /[A-Z]{1,2}$/;
        return reference.replace(colorCodePattern, '');
    }

    /**
     * Processa variante de produto (adiciona cor)
     * @private
     */
    #processProductVariant(reference, description) {
        console.log("DEBUG: Processando variante");
        console.log("Referência completa:", reference);
        console.log("Referência base atual:", this.currentProduct.reference);

        // Extrai código de cor da referência
        const colorCode = this.#extractColorFromReference(reference);
        console.log("Código de cor extraído:", colorCode);

        if (colorCode) {
            this.#addColorToCurrentProduct(colorCode);
        }
    }

    /**
     * Extrai código de cor da referência
     * @private
     */
    #extractColorFromReference(reference) {
        // Pega os últimos 1-2 caracteres como código de cor
        const baseReference = this.currentProduct.reference;
        const colorPart = reference.slice(baseReference.length);
        
        console.log("Parte da cor na referência:", colorPart);
        
        return colorPart || null;
    }

    /**
     * Adiciona cor ao produto atual
     * @private
     */
    #addColorToCurrentProduct(colorCode) {
        console.log("DEBUG: Adicionando cor ao produto atual");
        console.log("Código de cor:", colorCode);
        console.log("Cores atuais:", this.currentProduct.colors);

        if (colorCode === ProductProcessor.SORTED_CODE) {
            this.currentProduct.colors = ProductProcessor.SORTED_CODE;
        } else if (Array.isArray(this.currentProduct.colors)) {
            if (!this.currentProduct.colors.includes(colorCode)) {
                this.currentProduct.colors.push(colorCode);
            }
        } else {
            this.currentProduct.colors = [colorCode];
        }

        console.log("Cores após adição:", this.currentProduct.colors);
    }

    /**
     * Inicia um novo produto
     * @private
     */
    async #startNewProduct(fashionStyle, baseReference, description, price) {
        console.log("DEBUG: Iniciando novo produto");
        console.log("Referência base:", baseReference);

        // Salva produto anterior se existir
        if (this.currentProduct.reference) {
            try {
                console.log("Salvando produto anterior:", this.currentProduct);
                const savedProduct = await this.#saveProduct({ ...this.currentProduct });
                this.processingResults.push(savedProduct);
                console.log("Produto anterior salvo com sucesso");
            } catch (error) {
                console.error("Erro ao salvar produto anterior:", error.message);
                throw error;
            }
        }

        // Inicializa novo produto
        this.currentProduct = {
            fashionStyle,
            reference: baseReference,
            description: this.#cleanDescription(description),
            sizes: this.#extractSizes(description),
            colors: [],
            price,
        };

        console.log("Novo produto inicializado:", this.currentProduct);
    }

    /**
     * Remove palavras de cores da descrição
     * @private
     */
    #removeColorWordsFromDescription(description) {
        if (!description || typeof description !== "string") {
            return description;
        }

        const descUpper = description.toUpperCase();
        const KEEP_COLOR_PRODUCTS = ["SACOLA", "BOLSA"];

        // Verifica se deve manter cores
        const shouldKeepColor = KEEP_COLOR_PRODUCTS.some((product) =>
            descUpper.startsWith(product)
        );

        if (shouldKeepColor) {
            return description;
        }

        let newDescription = description;

        // Busca apenas palavras COMPLETAS, não substrings
        for (const color of ProductProcessor.COLOR_WORDS) {
            const wordBoundaryPattern = new RegExp(`\\b${color}\\b`, "gi");
            const matches = [...newDescription.matchAll(wordBoundaryPattern)];

            if (matches.length > 0) {
                // Pega o primeiro match e remove tudo a partir dali
                const firstMatch = matches[0];
                newDescription = newDescription.slice(0, firstMatch.index).trim();
                break;
            }
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
            .replace(/SORTIDOU|SORTIDO|SORTIMENTO/gi, "")
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

    /**
     * Extrai informações de tamanho da descrição
     * @private
     */
    #extractSizes(description) {
        if (!description) return ProductProcessor.DEFAULT_SIZE;

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

