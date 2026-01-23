const form = document.querySelector(".form--cupom-de-troca");
const input = form.querySelector(".form__input");
const iframe = document.querySelector("#iframeContent");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const exchangeCoupeNumber = input.value;
    console.log(exchangeCoupeNumber);

    localStorage.setItem("exchangeCoupeNumber", JSON.stringify(exchangeCoupeNumber));

    iframe.src = "print-copy.html";
    iframe.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(iframe.contentWindow.document.body.innerHTML, 10, 10);
    };
});
