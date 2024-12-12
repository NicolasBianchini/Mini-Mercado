let carrinho = [];


document.getElementById('imagem').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Função para exibir o alerta personalizado
function showCustomAlert(message, callback) {
    const alertElement = document.getElementById('alerta-custom');
    const messageElement = document.getElementById('mensagem');
    const okButton = document.getElementById('alerta-ok');
    

    messageElement.textContent = message;
    alertElement.classList.remove('hidden');

    okButton.onclick = () => {
        alertElement.classList.add('hidden');
        if (callback) callback();
    };
}

function adicionarCarrinho(produto, preco, estoque) {
    let quantidade = prompt("Digite a quantidade que deseja comprar:");

    quantidade = parseInt(quantidade);

    if (quantidade <= 0 || isNaN(quantidade)) {
        showCustomAlert("Quantidade inválida!");
        return;
    }

    estoque = parseInt(estoque);

    if (quantidade > estoque) {
        showCustomAlert("Quantidade solicitada excede o estoque disponível.");
        return;
    }

    // Verifica se o produto já existe no carrinho
    const produtoExistente = carrinho.find(item => item.produto.id === produto.id);

    if (produtoExistente) {
        if (produtoExistente.quantidade + quantidade <= estoque) {
            produtoExistente.quantidade += quantidade;
            showCustomAlert("Quantidade atualizada no carrinho.");
        } else {
            showCustomAlert("Quantidade solicitada excede o estoque disponível.");
        }
    } else {
        carrinho.push({
            produto,
            preco: parseFloat(preco),
            quantidade: quantidade
        });
        showCustomAlert("Produto adicionado ao carrinho com sucesso!");
    }

    atualizarCarrinho();
}

// Função de exemplo para atualizar o carrinho
function atualizarCarrinho() {
    console.log("Carrinho atualizado:", carrinho);
}

// envia dados do carrinho para o backend quando finaliza a compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }

    fetch('/finalizar-compra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ carrinho: carrinho })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            carrinho = [];
            atualizarCarrinho();
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error("Erro ao finalizar a compra:", error);
        alert("Ocorreu um erro ao finalizar a compra.");
    });
}

// limpa o carrinho
function limparCarrinho() {
    carrinho = [];
    atualizarCarrinho();
}

// atualizaro carrinho na interface do usuário
function atualizarCarrinho() {
    const carrinhoLista = document.getElementById('carrinho-compras');
    carrinhoLista.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantidade} x ${item.produto} - R$${item.preco.toFixed(2)}`;

        // adiciona a classe de animação ao item recém-adicionado
        li.classList.add('item-adicionado');
        carrinhoLista.appendChild(li);

        total += item.preco * item.quantidade;
    });

    // atualiza o total na tela
    document.getElementById('total-valor').textContent = total.toFixed(2);

    const carrinhoDiv = document.getElementById('meu-carrinho');

    // exibe ou esconde o carrinho dependendo se há itens
    if (carrinho.length > 0) {
        carrinhoDiv.style.display = 'flex';
        setTimeout(() => {
            carrinhoDiv.classList.add('mostrar');
        }, 10);
    } else {
        carrinhoDiv.classList.remove('mostrar');
        setTimeout(() => {
            carrinhoDiv.style.display = 'none';
        }, 500);
    }
}

// busca de produtos
const buscaInput = document.getElementById('busca-produtos');

buscaInput.addEventListener('input', function() {
    const termo = buscaInput.value;

    if (termo.length >= 3) {
        window.location.href = `/buscar?term=${termo}`;
    } else if (termo.length === 0) {
        window.location.href = '/mercado';
    }
});
