document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".product-list");

    function renderProducts() {
        productList.innerHTML = "";

        productsData.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";

            const initialVariant = product.variants[0];
            const initialPrice = product.type === "size" ? initialVariant.price : product.price;
            const initialRef = initialVariant.reference;

            // Define o título de acordo com o tipo do produto
            const groupTitle = product.type === "size" ? "Tamanho:" : "Cor:";

            // Gera os radios e labels lado a lado
            const optionsHtml = product.variants.map((variant, index) => {
                const inputId = `prod-${product.id}-var-${index}`;
                const isChecked = index === 0 ? "checked" : "";

                if (product.type === "size") {
                    const shortLabel = variant.label.replace("Tam: ", "");

                    return `
                        <li class="product-card__option-item">
                            <input 
                                type="radio" 
                                id="${inputId}" 
                                name="product-${product.id}" 
                                value="${index}" 
                                class="product-card__option-radio" 
                                ${isChecked}
                            />

                            <label for="${inputId}" class="product-card__option-label">${shortLabel}</label>
                        </li>
                    `;
                } else {
                    return `
                        <li class="product-card__option-item">
                            <input 
                                type="radio" 
                                id="${inputId}" 
                                name="product-${product.id}" 
                                value="${index}" 
                                class="product-card__option-radio" 
                                ${isChecked}
                            />

                            <label 
                                for="${inputId}" 
                                class="product-card__option-label product-card__option-label--color" 
                                style="background-color: ${variant.color};" 
                                title="${variant.label}">
                            </label>
                        </li>
                    `;
                }
            }).join("");

            card.innerHTML = `
                
                <img src="${product.image}" alt="${product.description}" class="product-card__img"/>

                <div class="product-card__content">
                
                <p class="product-card__description">${product.description}</p>
                
                <div class="product-card__options"> 
                
                    <!-- Título/Label indicando o tipo de variante -->
                    <span class="product-card__options-label">${groupTitle}</span>
                    
                    <!-- Opções em formato de Radio Buttons lado a lado -->
                    <ul class="product-card__option-list">
                    ${optionsHtml}
                    </ul>
                </div>

                
                    <div class="product-card__details">
                        <p class="product-card__price">${initialPrice}</p>
                        <p class="product-card__reference">${initialRef}</p>
                        </div>
                        <button class="btn btn--soft btn--medium btn--full-width btn-copy" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn__icon">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
                                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                            </svg>
                            <span>Copiar Referência</span>
                        </button>
                </div>        
                
            `;

            // Elementos de texto do cartão
            const priceEl = card.querySelector(".product-card__price");
            const refEl = card.querySelector(".product-card__reference");

            // Evento ao trocar de opção
            const radioInputs = card.querySelectorAll(".product-card__option-list");
            radioInputs.forEach(radio => {
                radio.addEventListener("change", (e) => {
                    const selectedIndex = e.target.value;
                    const selectedVariant = product.variants[selectedIndex];

                    refEl.textContent = selectedVariant.reference;

                    if (product.type === "size") {
                        priceEl.textContent = selectedVariant.price;
                    }
                });
            });

            // // Botão Copiar Referência
            // const copyBtn = card.querySelector(".btn-copy");
            // // Guarda o HTML original apenas UMA vez ao iniciar
            // const originalContent = copyBtn.innerHTML;
            // let copyTimeout = null;

            // copyBtn.addEventListener("click", () => {
            //     const currentRef = refEl.textContent;

            //     navigator.clipboard.writeText(currentRef).then(() => {
            //         copyBtn.classList.add("btn--success");
            //         copyBtn.innerHTML = `
            //             <span>Copiado!</span>
            //         `;

            //         // Cancela o timer anterior se houver um rodando
            //         clearTimeout(copyTimeout);

            //         // Inicia um novo timer
            //         copyTimeout = setTimeout(() => {
            //             copyBtn.classList.remove("btn--success");
            //             copyBtn.innerHTML = originalContent;
            //         }, 1500);
            //     });
            // });


            // Botão Copiar Referência
            const copyBtn = card.querySelector(".btn-copy");
            const originalContent = copyBtn.innerHTML;
            let copyTimeout = null;

            // Função fallback para copiar em navegadores mobile ou HTTP sem HTTPS
            const copyToClipboard = async (text) => {
                if (navigator.clipboard && window.isSecureContext) {
                    try {
                        await navigator.clipboard.writeText(text);
                        return true;
                    } catch (err) {
                        // Se falhar a API nativa, tenta o fallback
                    }
                }

                // Fallback via elemento auxiliar no DOM
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                let successful = false;
                try {
                    successful = document.execCommand("copy");
                } catch (err) {
                    successful = false;
                }

                document.body.removeChild(textArea);
                return successful;
            };

            copyBtn.addEventListener("click", async () => {
                const currentRef = refEl.textContent.trim();
                const success = await copyToClipboard(currentRef);

                if (success) {
                    copyBtn.classList.add("btn--success");
                    copyBtn.innerHTML = `<span>Copiado!</span>`;

                    // Cancela o timer anterior se houver um rodando
                    clearTimeout(copyTimeout);

                    // Inicia um novo timer
                    copyTimeout = setTimeout(() => {
                        copyBtn.classList.remove("btn--success");
                        copyBtn.innerHTML = originalContent;
                    }, 1500);
                } else {
                    alert("Não foi possível copiar o texto");
                }
            });


            productList.appendChild(card);
        });


    }

    renderProducts();
});