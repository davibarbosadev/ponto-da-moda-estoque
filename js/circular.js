// js/circular.js

export function initCircularPage() {
    const form = document.querySelector(".form--circular");
    const notification = document.querySelector(".copied-notice");

    // GUARDA DE SEGURANÇA: Se o formulário não existir na página atual, aborta
    if (!form) return;

    let newString = "";

    const stringToArray = (str) => {
        return str.split(/\s+/);
    };

    const formatNewString = (array) => {
        return array.map(ref => ref + "   ,").join("");
    };

    const showNotification = () => {
        if (!notification) return;
        notification.classList.add("active");
        setTimeout(() => {
            notification.classList.remove("active");
        }, 1000);
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

    form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        const str = form.text.value.trim();
        if (!str) return;

        const references = stringToArray(str);
        newString = formatNewString(references);
        copy();

        form.text.value = "";
    });
}