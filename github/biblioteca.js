let livros = JSON.parse(localStorage.getItem('livros')) || [];

const livroForm = document.getElementById('livro-form');
const livroLista = document.getElementById('livro-lista');

function salvarLivros() {
    localStorage.setItem('livros', JSON.stringify(livros));
}

function definirClasseStatus(status) {
    if (status === "Lido") return "status-lido";
    if (status === "Lendo") return "status-lendo";
    if (status === "Quero ler") return "status-Quero-ler";
    return "";
}

function renderizarLivros() {
    livroLista.innerHTML = '';

    if (livros.length === 0) {
        livroLista.innerHTML = '<p>Nenhum livro cadastrado.</p>';
        return;
    }

    livros.forEach(livro => {
        const card = document.createElement('div');
        card.className = 'livro-card';

        card.innerHTML = `
            <div class="livro-info">
                <p><strong>Título:</strong> ${livro.titulo}</p>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano:</strong> ${livro.ano}</p>
                <p><strong>Gênero:</strong> ${livro.genero}</p>
                <p><strong>Status:</strong> 
                    <span class="status-tag ${definirClasseStatus(livro.status)}">
                        ${livro.status}
                    </span>
                </p>
            </div>
            <div class="livro-acoes">
                <button class="excluir" onclick="excluirLivro(${livro.id})">Excluir</button>
            </div>
        `;

        livroLista.appendChild(card);
    });
}

livroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ano = document.getElementById('ano').value;
    const genero = document.getElementById('genero').value;
    const status = document.getElementById('status').value;

    const novoLivro = {
        id: Date.now(),
        titulo,
        autor,
        ano,
        genero,
        status
    };

    livros.push(novoLivro);

    salvarLivros();
    renderizarLivros();
    livroForm.reset();
});

function excluirLivro(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        livros = livros.filter(livro => livro.id !== id);
        salvarLivros();
        renderizarLivros();
    }
}


renderizarLivros();

