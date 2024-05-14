let livros = [];
const endpointDaAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';
const listaLivros = document.getElementById('livros');
const botoes = document.querySelectorAll('.btn')
const botaoOrdenarPreco = document.getElementById('btnOrdenarPorPreco');
const botaoLivrosDiponiveis = document.getElementById('btnLivrosDisponiveis');
const descontoLivrosDisponiveis = document.getElementById('valor_total_livros_disponiveis')
const valorTotalDisponiveis = document.getElementById('valor')

getLivrosDaAPI();

//Criando uma função assicrona
async function getLivrosDaAPI() {
    //tratamento de resposta simples
    try {
        //Usando o await informando que espero algo
        const res = await fetch(endpointDaAPI);
        //Usar o metodo json() para tnsformar em json e guadar na minha lista
        livros = await res.json();
        let livrosComDesconto = aplicarDesconto(livros);
        showLivros(livrosComDesconto)
    } catch (e) {
        listaLivros.innerHTML = `<p>Nenhum livro encontrado, Erro: ${e}.`
    }
}

function showLivros(lista) {
    listaLivros.innerHTML = ``;
    descontoLivrosDisponiveis.style.display = "none";
    lista.forEach(item => {
        let disponibilidade = item.quantidade > 0 ? 'livro__imagem':'livro__imagem indisponivel';
        listaLivros.innerHTML += `
        <div class="livro">
        <img class="${disponibilidade}" src="${item.imagem}" alt="${item.alt}" />
        <h2 class="livro__titulo">${item.titulo}</h2>
        <p class="livro__descricao">${item.autor}</p>
        <p class="livro__preco" id="preco">R$${item.preco}</p>
        <div class="tags">
          <span class="tag">${item.categoria}</span>
        </div>
      </div>`
    });
}

function aplicarDesconto(lista) {
    const desconto = 0.15;
    livrosComDesconto = lista.map((item) => {
        return { ...item, preco: (item.preco - (item.preco * desconto)).toFixed(2)}
    })
    return livrosComDesconto;
}

botoes.forEach( botao => botao.addEventListener('click', filtrarLivros))

function filtrarLivros(){
    const atributoBotao  = document.getElementById(this.id);
    const categoria = atributoBotao.value;
    const livrosFiltrados = categoria == 'disponiveis'? disponibilidadeLivros() : livros.filter(livro => livro.categoria == categoria);
    showLivros(livrosFiltrados);
    if(categoria == 'disponiveis'){
        let valorTotalLivrosDisponiveis = disponibilidadeLivros().reduce((acc, livro) => acc + livro.preco, 0).toFixed(2);
        valorTotalDisponiveis.innerHTML = valorTotalLivrosDisponiveis;
    }

}

botaoOrdenarPreco.addEventListener('click', ordenarPrecos);

function disponibilidadeLivros() {
    return livros.filter(livro => livro.quantidade > 0);
}

function ordenarPrecos(){
     let livrosOdenados = livros.sort((a, b) => a.preco - b.preco);
     showLivros(livrosOdenados);

}

botaoLivrosDiponiveis.addEventListener('click', showElement)
function showElement(){
    descontoLivrosDisponiveis.style.display = "block";
}

