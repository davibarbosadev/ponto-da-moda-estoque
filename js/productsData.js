const productsData = [
    // --- PRODUTOS POR TAMANHO ---
    {
        id: 1,
        description: "Sacola de Presente Verde Geométrico", //
        image: "assets/img/produtos/sacola-verde-geometrico-550-zoom.jpg", //
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 3,99", reference: "VAVERDEGEOMETRICOP" }, //
            { label: "Tam: M", price: "R$ 5,99", reference: "VAVERDEGEOMETRICOM" }, //
            { label: "Tam: G", price: "R$ 8,99", reference: "VAVERDEGEOMETRICOG" }  //
        ]
    },
    {
        id: 2,
        description: "Sacola de Presente Flores Colorida", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-flores-colorida-550-zoom.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 3,99", reference: "VAFLORESCOLORIDAP" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 5,99", reference: "VAFLORESCOLORIDAM" }  //[cite: 1]
        ]
    },
    {
        id: 3,
        description: "Sacola de Presente Estrela Dourada", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-estrela-dourada-550-zoom.jpg", //[cite: 1]
        type: "size",              
        variants: [
            { label: "Tam: P", price: "R$ 3,99", reference: "VAESTRELADOURADAP" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 5,99", reference: "VAESTRELADOURADAM" }, //[cite: 1]
            { label: "Tam: G", price: "R$ 8,99", reference: "VAESTRELADOURADAG" }  //[cite: 1]
        ]
    },
    {
        id: 4,
        description: "Sacola de Presente Ouro", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-ouro-550-zoom.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 3,99", reference: "VAMT2OUROP" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 5,99", reference: "VAMT2OUROM" }, //[cite: 1]
            { label: "Tam: G", price: "R$ 8,99", reference: "VAMT2OUROG" }  //[cite: 1]
        ]
    },
    {
        id: 5,
        description: "Sacola de Presente Coração Red", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-coracao-red.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 2,99", reference: "VACORACAOREDPQUA" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 3,99", reference: "VACORACAOREDMQUA" }, //[cite: 1]
            { label: "Tam: G", price: "R$ 6,99", reference: "VACORACAOREDGQUA" }  //[cite: 1]
        ]
    },
    {
        id: 6,
        description: "Sacola de Presente Folhagem", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-folhagem.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 2,99", reference: "VAFOLHAGEMPQUA" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 3,99", reference: "VAFOLHAGEMMQUA" }, //[cite: 1]
            { label: "Tam: G", price: "R$ 6,99", reference: "VAFOLHAGEMGQUA" }  //[cite: 1]
        ]
    },
    {
        id: 7,
        description: "Sacola de Presente Listras Verde", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-listras-verde.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 2,99", reference: "VALISTRAVERDEPQUA" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 3,99", reference: "VALISTRAVERDEMQUA" }  //[cite: 1]
        ]
    },
    {
        id: 8,
        description: "Sacola de Presente Praiano", //[cite: 1]
        image: "assets/img/produtos/sacola-presente-praiano.jpg", //[cite: 1]
        type: "size",
        variants: [
            { label: "Tam: P", price: "R$ 2,99", reference: "VAPRAIANOPQUA" }, //[cite: 1]
            { label: "Tam: M", price: "R$ 3,99", reference: "VAPRAIANOMQUA" }  //[cite: 1]
        ]
    },

    // --- PRODUTOS POR COR ---
    {
        id: 9,
        description: "Toalha Social c franja São Cristovão", //[cite: 1]
        image: "assets/img/produtos/toalha-social-com-franja-sao-cristovao.jpg", //[cite: 1]
        type: "color",
        price: "R$ 1,99", //[cite: 1]
        variants: [
            { color: "yellow", label: "Amarelo", reference: "LA1003SAOAM2U" }, //[cite: 1]
            { color: "skyblue", label: "Azul Céu", reference: "LA1003SAOAZ20U" }, //[cite: 1]
            { color: "blue", label: "Azul Royal", reference: "LA1003SAOAZ21U" }, //[cite: 1]
            { color: "white", label: "Branco", reference: "LA1003SAOBR2U" }, //[cite: 1]
            { color: "deeppink", label: "Pink", reference: "LA1003SAOPI3U" }, //[cite: 1]
            { color: "black", label: "Preto", reference: "LA1003SAOPR2U" }, //[cite: 1]
            { color: "pink", label: "Rosa Bebê", reference: "LA1003SAORO9U" }, //[cite: 1]
            { color: "red", label: "Vermelho", reference: "LA1003SAOVE5U" }, //[cite: 1]
            { color: "darkgreen", label: "Verde", reference: "LA1003SAOVE17U" } //[cite: 1]
        ]
    },
    {
        id: 10,
        description: "Toalha Lavabo São Cristovão", //[cite: 1]
        image: "assets/img/produtos/toalha-lavabo-sao-cristovao.jpg", //[cite: 1]
        type: "color",
        price: "R$ 4,99", //[cite: 1]
        variants: [
            { color: "yellow", label: "Amarelo", reference: "LA9003SAOAM2U" }, //[cite: 1]
            { color: "skyblue", label: "Azul Céu", reference: "LA9003SAOAZ20U" }, //[cite: 1]
            { color: "blue", label: "Azul Royal", reference: "LA9003SAOAZ21U" }, //[cite: 1]
            { color: "white", label: "Branco", reference: "LA9003SAOBR2U" }, //[cite: 1]
            { color: "deeppink", label: "Pink", reference: "LA9003SAOPI3U" }, //[cite: 1]
            { color: "black", label: "Preto", reference: "LA9003SAOPR2U" }, //[cite: 1]
            { color: "pink", label: "Rosa Bebê", reference: "LA9003SAORO9U" }, //[cite: 1]
            { color: "darkgreen", label: "Verde", reference: "LA9003SAOVE3U" }, //[cite: 1]
            { color: "red", label: "Vermelho", reference: "LA9003SAOVE5U" }  //[cite: 1]
        ]
    },
    {
        id: 11,
        description: "Toalha de Rosto floral São Cristovão", //[cite: 1]
        image: "assets/img/produtos/toalha-rosto-floral-sao-cristovao.jpg", //[cite: 1]
        type: "color",
        price: "R$ 9,99", //[cite: 1]
        variants: [
            { color: "yellow", label: "Amarelo", reference: "LA1075SAOAM2U" }, //[cite: 1]
            { color: "blue", label: "Azul Royal", reference: "LA1075SAOAZ21U" }, //[cite: 1]
            { color: "white", label: "Branco", reference: "LA1075SAOBR2U" }, //[cite: 1]
            { color: "black", label: "Preto", reference: "LA1075SAOPR2U" }, //[cite: 1]
            { color: "deeppink", label: "Pink", reference: "LA1075SAORO20U" }, //[cite: 1]
            { color: "pink", label: "Rosa Bebê", reference: "LA1075SAORO9U" }, //[cite: 1]
            { color: "darkgreen", label: "Verde", reference: "LA1075SAOVE17U" }, //[cite: 1]
            { color: "red", label: "Vermelho", reference: "LA1075SAOVE5U" }  //[cite: 1]
        ]
    }
];