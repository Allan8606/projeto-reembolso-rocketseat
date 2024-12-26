// Seleciona os elementos do formulário
const formulario = document.querySelector("form");
const valorDespesa = document.getElementById("amount");
const despesa = document.getElementById("expense");
const categoria = document.getElementById("category");

// Toda interação que acontecer com input, vai disparar esse evento, seja escrita de qualque coisa, ou apagar algo
valorDespesa.oninput = () => {
    let valueInput = valorDespesa.value.replace(/\D/g, ""); // Remove tudo que nao for numero

    // Transformando valores em centavos
    // Ex: Se o usuario digitar 150, vai acontecer 150/100 = 1.5, que é o equivalente a R$ 1,50
    valueInput = Number(valueInput) / 100;

    // Atualiza o valor do input
    valorDespesa.value = formatandoParaBRL(valueInput);
};

// Formatando para Real Brasileiro
function formatandoParaBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    // Retornando o valor formatado
    return value;
}

// Adiciona um evento de submit ao formulário para obter os valores
formulario.onsubmit = (event) => {
    event.preventDefault(); // Impede o comportamento de recarregar a pagina

    // Cria um objeto com os detalhes da despesa
    const novaDespesa = {
        id: new Date().getTime(),
        name: despesa.value,
        categoria_id: categoria.value,
        // Vai receber o texto da opcao selecionada
        categoria_name: categoria.options[categoria.selectedIndex].text,
        despesa: valorDespesa.value,
        quando_criadaDespesa: new Date(),
    };
};
