// Seleciona os elementos do formulário
const formulario = document.querySelector("form");
const valorDespesa = document.getElementById("amount");
const despesa = document.getElementById("expense");
const categoria = document.getElementById("category");

// Seleciona os elementos da lista
const listaDespesas = document.querySelector("ul");
const totalDespesas = document.querySelector("aside header p span");
const totalGasto = document.querySelector("aside header h2");

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

    // Chama a funcao para adicionar a despesa
    adicionaDespesa(novaDespesa);
};

// Funçao para adicionar uma nova despesa
function adicionaDespesa(novaDespesa) {
    try {
        // Cria o elemento li para adicionar na lista
        const despesaItem = document.createElement("li");
        despesaItem.classList.add("expense");

        // Cria o ícone img para adicionar na lista
        const despesaImg = document.createElement("img");
        despesaImg.setAttribute("src", `img/${novaDespesa.categoria_id}.svg`);
        despesaImg.setAttribute("alt", `${novaDespesa.categoria_name}`);

        // Cria a informação da despesa
        const despesaInfo = document.createElement("div");
        despesaInfo.classList.add("expense-info");

        // Cria o nome da despesa
        const despesaNome = document.createElement("strong");
        despesaNome.textContent = novaDespesa.name;

        // Cria a categoria da despesa
        const despesaCategoria = document.createElement("span");
        despesaCategoria.textContent = novaDespesa.categoria_name;

        // Adiciona nome e categoria na div de informações
        despesaInfo.append(despesaNome, despesaCategoria);

        // Cria o valor da despesa
        const despesaValor = document.createElement("span");
        despesaValor.classList.add("expense-amount");
        despesaValor.innerHTML = `<small>R$</small>${novaDespesa.despesa
            .toUpperCase()
            .replace("R$", "")}`;

        // Cria o ícone para remover a despesa
        const despesaRemover = document.createElement("img");
        despesaRemover.classList.add("remove-icon");
        despesaRemover.setAttribute("src", "img/remove.svg");
        despesaRemover.setAttribute("alt", "remover");

        // Adiciona as informações no item
        despesaItem.append(
            despesaImg,
            despesaInfo,
            despesaValor,
            despesaRemover
        );
        // Adiciona o item na lista
        listaDespesas.append(despesaItem);

        // Limpa o formulário para adicionar um novo item
        limpaFormulario();

        // Atualiza o total
        atualizaTotal();
    } catch (error) {
        alert("Não foi possivel adicionar a despesa");
        console.log(error);
    }
}

// Função para atualizar os totais
function atualizaTotal() {
    try {
        // Recupera todos os itens(li) da lista
        const itens = listaDespesas.children; // Pega todos os elementos filhos da listaDespesas

        // Atualiza a quantidade de despesas
        totalDespesas.textContent = `${itens.length} ${
            itens.length > 1 ? "despesas" : "despesa"
        }`; // Atualizando para o plural ou singular

        // Variável para incrementar o total
        let total = 0;
        // Percorre cada item(li) da lista
        for (let index = 0; index < itens.length; index++) {
            const valorItem = itens[index].querySelector(".expense-amount");

            // Remover caracteres não numericos e substitui virgula por ponto
            let valor = valorItem.textContent
                .replace(/[^\d,]/g, "")
                .replace(",", ".");

            // Converte para float
            valor = parseFloat(valor);

            //Verifica se é numero valido
            if (isNaN(valor)) {
                return alert(
                    "Não foi possível calcular o total. O valor não é valido"
                );
            }

            // Incrementar o total
            total += Number(valor);
        }

        // Criando a span para formatar o R$ formatado
        const simboloBRL = document.createElement("small");
        simboloBRL.textContent = "R$";

        // Formata o valor e remove o R$ e exibe o estilo que vem do CSS
        total = formatandoParaBRL(total).toUpperCase().replace("R$", "");

        // Limpa o conteudo do elemento
        totalGasto.textContent = "";

        // Adiciona o simbolo da moeda e o valor total formatado
        totalGasto.append(simboloBRL, total);
    } catch (error) {
        console.log(error);
        alert("Nao foi possivel atualizar os totais");
    }
}

// Evento  que captura o clique nos itens da lista
listaDespesas.addEventListener("click", (event) => {
    // Verificar se o elemento clicado é o icone de remover
    if (event.target.classList.contains("remove-icon")) {
        // Obtem a li do pai do elemento clicado
        const item = event.target.closest(".expense");
        // Remove a li da lista
        item.remove();
    }
    // Atualiza o total
    atualizaTotal();
});

// Limpa o formulário
function limpaFormulario() {
    // Limpa os inputs
    despesa.value = "";
    categoria.value = "";
    valorDespesa.value = "";

    // Coloca o foco no input
    despesa.focus();
}
