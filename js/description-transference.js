/* const form = document.querySelector(".form");
const descriptionList = document.querySelector(".description-list");
const btnClean = document.querySelector(".btn--clean");

let transferencetList = [];
let transferenceListJson;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const origin = form.origin.value;
    const target = form.target.value;
    const nfe = form.nfe.value;

    const volume = formatWithZero(form.volume.value);

    const transference = {
        origin,
        target,
        nfe,
        volume,
    };

    transferencetList.unshift(transference);
    addLocalStorage(transferencetList);
    showTransference(transferencetList);

    // console.log(transferencetList);

    // form.origin.value = "13";

    form.origin.value = "00";
    form.target.value = "00";
    form.nfe.value = "";
    form.volume.value = "";

    form.origin.focus();
});

const addLocalStorage = (transferencetList) => {
    transferenceListJson = JSON.stringify(transferencetList);
    localStorage.setItem("transferencetList", transferenceListJson);

    console.log(transferencetList);
};

const showTransference = () => {
    descriptionList.innerHTML = "";
    transferencetList.forEach((transference) => {
        descriptionList.innerHTML += `
            <div class="transference">
                <div class="transference__origin">
                    <span class="transference__text-title">De:</span>
                    <span class="transference__text-content">LJ-${transference.origin}</span>
                </div>
                <div class="transference__target">
                    <span class="transference__text-title">Para:</span>
                    <span class="transference__text-content">LJ-${transference.target}</span>
                </div>

                <div class="transference__nfe">
                    <span class="transference__text-title">Nf:</span>
                    <span class="transference__text-content">${transference.nfe}</span>
                </div>

                <div class="transference__number-volume">
                    <span class="transference__text-title">Vol:</span>
                    <span class="transference__text-content">${transference.volume}</span>
                </div>

                <div class="transference__options">
                    <ul class="btns-options">
                        <li>
                            <button class="btn--icons transference__btn-edit">
                                <ion-icon class="transference__btn-icon" name="pencil-outline"></ion-icon>
                            </button>
                        </li>

                        <li>
                            <button class="btn--icons transference__btn-delete">
                                <ion-icon class="transference__btn-icon" name="trash-outline"></ion-icon>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    });

    editTransference();
    deleteTransference();
};

const editTransference = () => {
    const btnsEdit = [...document.querySelectorAll(".btn-edit")];

    btnsEdit.forEach((item, index) => {
        item.addEventListener("click", () => {
            const transference = transferencetList.splice(index, 1);
            addLocalStorage(transferencetList);
            form.origin.value = transference[0].origin;
            form.target.value = transference[0].target;
            form.nfe.value = transference[0].nfe;
            form.volume.value = transference[0].volume;
            showTransference(transferencetList);
        });
    });
};

const deleteTransference = () => {
    const btnsDelete = [...document.querySelectorAll(".btn-delete")];

    btnsDelete.forEach((item, index) => {
        item.addEventListener("click", () => {
            // item.closest(".description-item-box").remove();
            const deleteTransference = confirm("Deseja excluir esse item?");
            if (deleteTransference) {
                transferencetList.splice(index, 1);
                addLocalStorage(transferencetList);
                showTransference(transferencetList);
            } else {
                return;
            }
        });
    });
};

btnClean.addEventListener("click", (evt) => {
    const allClean = confirm("Deseja limpar tudo?");
    if (allClean) {
        transferencetList.length = 0;
        addLocalStorage(transferencetList);
        location.reload();
    } else {
        return;
    }
});

const formatWithZero = (numero) => {
    return numero < 10 ? `0${numero}` : `${numero}`;
};

const toCheckLocalStorage = () => {
    if (JSON.parse(localStorage.getItem("transferencetList")) !== null) {
        transferencetList = JSON.parse(localStorage.getItem("transferencetList"));
        console.log(transferencetList);
        showTransference(transferencetList);
    }
};

toCheckLocalStorage();


  const stores = [
    { value: "01", text: "Loja - 01 (Guilherme Rocha)" },
    { value: "02", text: "Loja - 02 (Pacajus)" },
    { value: "03", text: "Loja - 03 (Cascavel)" },
    { value: "04", text: "Loja - 04 (Solon Pinheiro)" },
    { value: "05", text: "Loja - 05 (Juazeiro)" },
    { value: "06", text: "Loja - 06 (Maracanaú)" },
    { value: "07", text: "Loja - 07 (CD)" },
    { value: "08", text: "Loja - 08 (Sobral)" },
    { value: "09", text: "Loja - 09 (Caucaia)" },
    { value: "10", text: "Loja - 10 (Eusébio)" },
    { value: "11", text: "Loja - 11 (Messejana)" },
    { value: "12", text: "Loja - 12 (Rio Mar Kennedy)" },
    { value: "13", text: "Loja - 13 (Jóquei)" }
  ];

  function populateSelect(id, includeDefault = true) {
    const select = document.getElementById(id);
    select.innerHTML = includeDefault
      ? `<option value="" disabled selected>Escolha a loja</option>`
      : "";
    
    stores.forEach(store => {
      select.innerHTML += `<option value="${store.value}">${store.text}</option>`;
    });
  }

  populateSelect("origin");
  populateSelect("target");
 */

// Seleção de elementos
const form = document.querySelector(".form");
const descriptionList = document.querySelector(".description-list");
const btnClean = document.querySelector(".btn--clean");
const btnPrint = document.querySelector(".btn--print");

let transferenceList = JSON.parse(localStorage.getItem("transferenceList")) || [];

// Função para adicionar uma transferência
function addTransference(event) {
    event.preventDefault();

    const volume = form.volume.value;

    if (volume == 0) {
        alert("O volume não pode ser zero!");
        return; // Impede o envio do formulário
    }

    const transference = {
        origin: form.origin.value,
        target: form.target.value,
        nfe: form.nfe.value,
        volume: formatWithZero(form.volume.value),
    };

    transferenceList.unshift(transference);
    updateLocalStorage();
    renderTransferenceList();
    resetForm();
}

// Atualiza o localStorage
function updateLocalStorage() {
    localStorage.setItem("transferenceList", JSON.stringify(transferenceList));
}

// Renderiza a lista de transferências
function renderTransferenceList() {
    descriptionList.innerHTML = transferenceList
        .map(
            (transference, index) => `
                <div class="description transference">
                    <div class="transference__origin">
                        <span class="description__text-title">De:</span> 
                        <span class="description__text-content">LJ-${transference.origin}</span> 
                    </div>

                    <div class="transference__target">
                        <span class="description__text-title">Para:</span> 
                        <span class="description__text-content">LJ-${transference.target}</span> 
                    </div>
                    <div class="transference__nfe">
                        <span class="description__text-title">Nf:</span> 
                        <span class="description__text-content">${transference.nfe}</span> 
                    </div>

                    <div class="transference__number-volume">
                        <span class="description__text-title">Vol:</span> 
                        <span class="description__text-content">${transference.volume}</span> 
                    </div>

                    <div class="btns__options">
                        <button class="btn--icons btn-edit" data-index="${index}">
                            <ion-icon name="pencil-outline"></ion-icon>
                        </button>

                        <button class="btn--icons btn-delete" data-index="${index}">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                </div>
      `
        )
        .join("");
    attachEventListeners();
}

// Adiciona eventos aos botões de edição e exclusão
function attachEventListeners() {
    document
        .querySelectorAll(".btn-edit")
        .forEach((btn) => btn.addEventListener("click", editTransference));
    document
        .querySelectorAll(".btn-delete")
        .forEach((btn) => btn.addEventListener("click", deleteTransference));
}

// Edita uma transferência
function editTransference(event) {
    const index = event.target.closest("button").dataset.index;
    const transference = transferenceList.splice(index, 1)[0];
    updateLocalStorage();
    form.origin.value = transference.origin;
    form.target.value = transference.target;
    form.nfe.value = transference.nfe;
    form.volume.value = transference.volume;
    renderTransferenceList();
}

// Exclui uma transferência
function deleteTransference(event) {
    if (confirm("Deseja excluir esse item?")) {
        const index = event.target.closest("button").dataset.index;
        transferenceList.splice(index, 1);
        updateLocalStorage();
        renderTransferenceList();
    }
}

// Limpa todas as transferências
function clearAllTransferences() {
    if (confirm("Deseja limpar tudo?")) {
        transferenceList = [];
        updateLocalStorage();
        renderTransferenceList();
    }
}

// Formata número com zero à esquerda
function formatWithZero(numero) {
    const numStr = numero.toString();

    // Se já começa com "0" e tem mais de um dígito, retorna como está
    if (numStr.startsWith("0") && numStr.length > 1) {
        return numStr;
    }

    return numStr.length === 1 ? `0${numStr}` : numStr;
}

// Reseta o formulário
function resetForm() {
    form.reset();
    form.origin.focus();
}

// Imprime a lista de transferências
function printTransferences() {
    const content = transferenceList
        .map((t) => `LJ-${t.origin} → LJ-${t.target} | NF: ${t.nfe} | Vol: ${t.volume}`)
        .join("\n");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<pre>${content}</pre>`);
    printWindow.print();
}

// Popula os selects
function populateSelect(id) {
    const select = document.getElementById(id);
    select.innerHTML =
        '<option value="" disabled selected>Escolha a loja</option>' +
        stores.map((store) => `<option value="${store.value}">${store.text}</option>`).join("\n");
}

const stores = [
    { value: "01", text: "Loja - 01 (Guilherme Rocha)" },
    { value: "02", text: "Loja - 02 (Pacajus)" },
    { value: "03", text: "Loja - 03 (Cascavel)" },
    { value: "04", text: "Loja - 04 (Solon Pinheiro)" },
    { value: "05", text: "Loja - 05 (Juazeiro)" },
    { value: "06", text: "Loja - 06 (Maracanaú)" },
    { value: "07", text: "Loja - 07 (CD)" },
    { value: "08", text: "Loja - 08 (Sobral)" },
    { value: "09", text: "Loja - 09 (Caucaia)" },
    { value: "10", text: "Loja - 10 (Eusébio)" },
    { value: "11", text: "Loja - 11 (Messejana)" },
    { value: "12", text: "Loja - 12 (Rio Mar Kennedy)" },
    { value: "13", text: "Loja - 13 (Jóquei)" },
];

// Eventos principais
form.addEventListener("submit", addTransference);
btnClean.addEventListener("click", clearAllTransferences);
btnPrint.addEventListener("click", printTransferences);
populateSelect("origin");
populateSelect("target");
renderTransferenceList();
