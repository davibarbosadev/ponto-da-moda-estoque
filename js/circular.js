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
    }, 1000);
};
