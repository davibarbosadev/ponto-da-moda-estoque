// Seleciona todos os botões de copiar
const copyButtons = document.querySelectorAll('.btn--copy');

copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Encontra o item de produto mais próximo do botão clicado
        const productItem = this.closest('.product__item');
        
        // Pega o conteúdo da referência do produto
        const contentToCopy = productItem.querySelector('.product__reference').textContent.trim();
        
        // Copia para a área de transferência
        navigator.clipboard.writeText(contentToCopy).then(() => {
            // Feedback visual opcional
            this.querySelector('span').textContent = 'Copiado!';
            
            // Volta ao texto original após 2 segundos
            setTimeout(() => {
                this.querySelector('span').textContent = 'Copiar Referência';
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Não foi possível copiar o texto');
        });
    });
});