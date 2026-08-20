import '../sass/main.scss'; // Importa o SASS do projeto para o iframe

const body = document.querySelector("body");
let productList;

// Função para gerar uma linha da tabela
const createTableRow = (product) => {
    // Determina o label baseado na referência
    const getStyleLabel = (reference) => {
        return /^(VA|VC|LA|CI)/.test(reference) ? 'Seção' : 'Estilo';
    };

    return `
        <tr class="product">
            <td class="product__img">
                <img src="../assets/img/LOGO-PONTO-DA-MODA-COLORIDA.jpg" alt="logo ponto da moda"/>
            </td>
            <td class="product__description">
                <span class="product__text-content">${product.description}</span>
            </td>
            <td class="product__reference">
                <span class="product__text-title">Ref:</span>
                <span class="product__text-content">${product.reference}</span>
            </td>
            <td class="product__fashion-style">
                <span class="product__text-title">${getStyleLabel(product.reference)}:</span>
                <span class="product__text-content">${product.fashionStyle}</span>
            </td>
            <td class="product__sizes">
                <span class="product__text-title">Tam:</span>
                <span class="product__text-content">${product.sizes}</span>
            </td>

            <td class="product__colors">
                <span class="product__text-title">Cores:</span>
                <span class="product__text-content">
                    ${product.colors.join(" - ")}
                </span>
            </td>
            
            <td class="product__price">
                <span class="product__text-title">R$:</span>
                <span class="product__text-content">${product.price
            .toString()
            .replace(".", ",")}</span>
            </td>
        </tr>
    `;
};

// Função para ordenar os produtos
const sortProducts = (products) => {
    // Ordem de prioridade para as referências
    const referenceOrder = ['CM', 'CF', 'CI', 'LA', 'VA', 'VC'];

    return products.sort((a, b) => {
        // Extrai o prefixo da referência (ex: CM, CF, CI, LA, VA)
        const getRefPrefix = (ref) => {
            const match = ref.match(/^[A-Z]{2}/);
            return match ? match[0] : ref;
        };

        const refA = getRefPrefix(a.reference);
        const refB = getRefPrefix(b.reference);

        // Compara por referência primeiro
        const refIndexA = referenceOrder.indexOf(refA);
        const refIndexB = referenceOrder.indexOf(refB);

        // Se as referências são diferentes, ordena por elas
        if (refIndexA !== refIndexB) {
            // Se uma referência não está na lista, coloca no final
            if (refIndexA === -1) return 1;
            if (refIndexB === -1) return -1;
            return refIndexA - refIndexB;
        }

        // Se as referências são iguais, ordena por estilo alfabeticamente
        const styleA = a.fashionStyle.toLowerCase();
        const styleB = b.fashionStyle.toLowerCase();

        return styleA.localeCompare(styleB, 'pt-BR', { sensitivity: 'base' });
    });
};

const createPDF = () => {
    let sheet = "";
    const sortedProducts = sortProducts(productList);

    for (let index = 0; index < sortedProducts.length; index++) {
        if (index % 13 === 0) {
            if (index !== 0) sheet += `</table>`;
            sheet += `<table>`;
        }

        sheet += createTableRow(sortedProducts[index]);

        if ((index + 1) % 13 === 0 || index === sortedProducts.length - 1) {
            sheet += `</table>`;
        }
    }

    body.innerHTML = sheet;

    // Dispara a impressão garantindo o contexto da janela atual
    setTimeout(() => {
        window.focus();
        window.print();
    }, 300);
};

const toCheckLocalStorage = () => {
    const storedProductList = localStorage.getItem("productList");
    if (storedProductList) {
        productList = JSON.parse(storedProductList);
        createPDF(); // Criação do PDF após carregar os produtos
    } else {
        console.error("Produto não encontrado no localStorage");
    }
};

toCheckLocalStorage();