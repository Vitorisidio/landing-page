const API_PRODUTOS = 'http://localhost:8081/v1/vibecoffee/produto';
const API_CATEGORIAS = 'http://localhost:8081/v1/vibecoffee/categoria';

const menu = document.querySelector('.menu');
const containerCard = document.querySelector('.container-card');
const botaoVerTudo = document.getElementById('ver-tudo');

const setaEsquerda = document.getElementById('seta-esquerda');
const setaDireita = document.getElementById('seta-direita');

let todasCategorias = [];
let todosProdutos = [];
let produtosCategoriaAtual = [];

let aberto = false;

let paginaCategoria = 0;
const LIMITE_CATEGORIAS = 4;

// ======================================================
// BUSCAR CATEGORIAS
// ======================================================

async function carregarCategorias() {

    const response = await fetch(API_CATEGORIAS);
    const dados = await response.json();

    todasCategorias = dados.response.categoria.reverse();

    renderizarCategorias();
}

// ======================================================
// BUSCAR PRODUTOS
// ======================================================

async function carregarProdutos() {

    const response = await fetch(API_PRODUTOS);
    const dados = await response.json();

    todosProdutos = dados.response.produto;
}

// ======================================================
// RENDERIZAR CATEGORIAS
// ======================================================

function renderizarCategorias() {

    menu.replaceChildren();

    const inicio = paginaCategoria * LIMITE_CATEGORIAS;
    const fim = inicio + LIMITE_CATEGORIAS;

    const categoriasVisiveis =
        todasCategorias.slice(inicio, fim);

    categoriasVisiveis.forEach(categoria => {

        const botao = document.createElement('button');

        botao.textContent =
            categoria.categoria.toUpperCase();

        botao.addEventListener('click', () => {

            document
                .querySelectorAll('.menu button')
                .forEach(btn =>
                    btn.classList.remove('ativo')
                );

            botao.classList.add('ativo');

            filtrarCategoria(categoria.id);

        });

        menu.appendChild(botao);

    });

}

// ======================================================
// FILTRAR PRODUTOS
// ======================================================

function filtrarCategoria(idCategoria) {

    aberto = false;

    produtosCategoriaAtual = todosProdutos.filter(produto =>

        produto.tipo_categoria.some(item =>
            item.id_categoria === idCategoria
        )

    );

    renderizarProdutos(produtosCategoriaAtual);

    botaoVerTudo.textContent = 'VER TUDO';
}

// ======================================================
// RENDERIZAR PRODUTOS
// ======================================================

function renderizarProdutos(produtos) {

    containerCard.replaceChildren();

    const lista =
        aberto
            ? produtos
            : produtos.slice(0, 8);

    lista.forEach(produto => {

        const preco =
            produto.tipo_categoria[0].preco;

        const card =
            document.createElement('div');

        card.classList.add('card-produto');

        const fotoContainer =
            document.createElement('div');

        fotoContainer.classList.add('foto-produto');

        const imagem =
            document.createElement('img');

        imagem.src =
            `img/${produto.foto}`;

        imagem.alt =
            produto.nome;

        fotoContainer.appendChild(imagem);

        const nome =
            document.createElement('p');

        nome.classList.add('nome-produto');
        nome.textContent = produto.nome;

        const descricao =
            document.createElement('p');

        descricao.classList.add('descricao-produto');
        descricao.textContent = produto.descricao;

        const precoProduto =
            document.createElement('p');

        precoProduto.classList.add('preco-produto');
        precoProduto.textContent =
            `R$ ${preco}`;

        const btnDetalhes =
            document.createElement('button');

        btnDetalhes.classList.add('ver-detalhes');

        const textoBtn =
            document.createElement('p');

        textoBtn.textContent =
            'VER DETALHES';

        btnDetalhes.appendChild(textoBtn);

        card.appendChild(fotoContainer);
        card.appendChild(nome);
        card.appendChild(descricao);
        card.appendChild(precoProduto);
        card.appendChild(btnDetalhes);

        containerCard.appendChild(card);

    });

    if (produtos.length <= 8) {

        botaoVerTudo.style.display =
            'none';

    } else {

        botaoVerTudo.style.display =
            'flex';

    }

}

// ======================================================
// BOTÃO VER TUDO
// ======================================================

botaoVerTudo.addEventListener('click', () => {

    aberto = !aberto;

    renderizarProdutos(produtosCategoriaAtual);

    botaoVerTudo.textContent =
        aberto
            ? 'VER MENOS'
            : 'VER TUDO';

});

// ======================================================
// SETA DIREITA
// ======================================================

setaDireita.addEventListener('click', () => {

    const totalPaginas =
        Math.ceil(
            todasCategorias.length /
            LIMITE_CATEGORIAS
        );

    if (paginaCategoria < totalPaginas - 1) {

        paginaCategoria++;

        renderizarCategorias();

    }

});

// ======================================================
// SETA ESQUERDA
// ======================================================

setaEsquerda.addEventListener('click', () => {

    if (paginaCategoria > 0) {

        paginaCategoria--;

        renderizarCategorias();

    }

});

// ======================================================
// ÍCONES DA HOME
// ======================================================

document
    .querySelector('.circulo-cafe')
    .addEventListener('click', () => {

        paginaCategoria = 0;
        renderizarCategorias();
        filtrarCategoria(1);

    });

document
    .querySelector('.circulo-cha')
    .addEventListener('click', () => {

        paginaCategoria = 0;
        renderizarCategorias();
        filtrarCategoria(2);

    });

document
    .querySelector('.circulo-doce')
    .addEventListener('click', () => {

        paginaCategoria = 0;
        renderizarCategorias();
        filtrarCategoria(3);

    });

document
    .querySelector('.circulo-drinks')
    .addEventListener('click', () => {

        paginaCategoria = 0;
        renderizarCategorias();
        filtrarCategoria(4);

    });

// ======================================================
// INICIAR
// ======================================================

async function iniciar() {

    await carregarCategorias();

    await carregarProdutos();

    filtrarCategoria(1);

}

iniciar();