/* const form = document.querySelector(".form--circular");
const notification = document.querySelector(".copied-notice");

let newString = "";

form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const str = form.text.value.trim(); // Usando .trim() para remover espaços extras
    const references = stringToArray(str); // Refatorado para gerar a lista de referências diretamente

    newString = formatNewString(references); // Gerando a nova string formatada
    copy();

    form.text.value = "";
});

const stringToArray = (str) => {
    return str.split(/\s+/); // Usando .split() para separar a string em palavras, ignorando múltiplos espaços
};

const formatNewString = (array) => {
    return array.join(","); // Utilizando .join() para formatar a string de maneira simples
};

const copy = () => {
    navigator.clipboard.writeText(newString);
    notification.classList.add("active");
    setTimeout(() => {
        notification.classList.remove("active");
    }, 3000);
};
 */

const form = document.querySelector(".form--circular");
const notification = document.querySelector(".copied-notice");

let newString = "";

form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const str = form.text.value.trim();
    const references = stringToArray(str);

    newString = formatNewString(references);
    copy();

    form.text.value = "";
});

const stringToArray = (str) => {
    return str.split(/\s+/);
};

const formatNewString = (array) => {
    return array.join(",");
};

const copy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(newString)
            .then(() => {
                showNotification();
            })
            .catch(err => {
                alert('Falha ao copiar: ' + err);
            });
    } else {
        alert('Clipboard API não suportada neste navegador');
    }
};

const showNotification = () => {
    notification.classList.add("active");
    setTimeout(() => {
        notification.classList.remove("active");
    }, 3000);
};
