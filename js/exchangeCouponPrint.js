// ====== CONFIGURAÇÕES ======
const storedExchangeCoupeNumber = localStorage.getItem("exchangeCoupeNumber");
const exchangeCoupeNumber = JSON.parse(storedExchangeCoupeNumber);
const DAYS_FOR_EXCHANGE = 30;

// ====== DATA DA COMPRA (HOJE) ======
const purchaseDate = new Date();

// ====== DATA LIMITE DE TROCA ======
const exchangeDate = new Date(purchaseDate);
exchangeDate.setDate(exchangeDate.getDate() + DAYS_FOR_EXCHANGE);

// ====== FORMATAÇÃO ======
const formatDate = (date) => date.toLocaleDateString("pt-BR");

const formatDateAndTime = (data) =>
    data.toLocaleDateString("pt-BR") + " - " + data.toLocaleTimeString("pt-BR");

// ====== INSERÇÃO NO HTML ======
document.getElementById("data-troca").textContent = formatDate(exchangeDate);

JsBarcode("#codigo-barras", String(exchangeCoupeNumber), {
    format: "CODE128",
    width: 2,
    height: 30,
    displayValue: true,
    margin: 1,
});

document.getElementById("data-geracao").textContent = formatDateAndTime(new Date());

setTimeout(() => {
    print();
}, 300);
