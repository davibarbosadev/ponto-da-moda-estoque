const body = document.querySelector("body");

let productList;

// Função para gerar uma linha da tabela
const createTableRow = (product) => {
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
            <td class="product__sizes">
                <span class="product__text-title">Tam:</span> 
               <span class="product__text-content">${product.sizes}</span> 
            </td>
            <td class="product__colors">
                <span class="product__text-title">Cores:</span> 
               <span class="product__text-content">${product.colors}</span> 
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

const createPDF = () => {
    let sheet = "";

    // Iterando pela lista de produtos
    for (let index = 0; index < productList.length; index++) {
        // Quando for o início de uma nova página ou o primeiro produto, cria uma nova tabela
        if (index % 13 === 0) {
            if (index !== 0) {
                sheet += `</table>`; // Fechar a tabela anterior
            }
            sheet += `<table>`; // Iniciar uma nova tabela
        }

        // Adicionando a linha de produto
        sheet += createTableRow(productList[index]);

        // Se for o último produto da página, fecha a tabela
        if ((index + 1) % 13 === 0 || index === productList.length - 1) {
            sheet += `</table>`;
        }
    }

    // Adiciona o conteúdo gerado ao body
    body.innerHTML = sheet;

    // Aguardar um breve intervalo antes de imprimir
    setTimeout(() => {
        print();
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
