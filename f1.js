let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
let idAtual  = parseInt(localStorage.getItem("idAtual")) || 1;

function salvarEstado() {
  localStorage.setItem("pilotos", JSON.stringify(pilotos));
  localStorage.setItem("idAtual", idAtual);
}

function createPiloto(nome, equipe, pontos) {
  const novo = { id: idAtual++, nome: nome.trim(), equipe: equipe.trim(), pontos: Number(pontos) };
  pilotos.push(novo);
  salvarEstado();
  return novo;
}

function readPilotos() {
  return [...pilotos].sort((a, b) => b.pontos - a.pontos);
}

function updatePiloto(id, nome, equipe, pontos) {
  const piloto = pilotos.find(p => p.id === id);
  if (!piloto) return false;
  piloto.nome   = nome.trim();
  piloto.equipe = equipe.trim();
  piloto.pontos = Number(pontos);
  salvarEstado();
  return true;
}

function deletePiloto(id) {
  const antes = pilotos.length;
  pilotos = pilotos.filter(p => p.id !== id);
  salvarEstado();
  return pilotos.length < antes;
}

const form        = document.getElementById("form");
const lista       = document.getElementById("lista");
const mensagemEl  = document.getElementById("mensagem");
const btnSalvar   = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagemEl.textContent = texto;
  mensagemEl.className = tipo;
  setTimeout(() => { mensagemEl.textContent = ""; mensagemEl.className = ""; }, 3000);
}

function medalClass(index) {
  return ["medal-1","medal-2","medal-3"][index] || "medal-n";
}

function renderizar() {
  const dados = readPilotos();
  const idEditando = document.getElementById("id").value;
  const maxPts = dados.length > 0 ? dados[0].pontos : 1;

  lista.innerHTML = "";

  if (dados.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhum piloto cadastrado ainda.</p>';
    return;
  }

  dados.forEach((p, index) => {
    const pct = maxPts > 0 ? Math.round((p.pontos / maxPts) * 100) : 0;
    const div = document.createElement("div");
    div.classList.add("card");
    if (String(p.id) === String(idEditando)) div.classList.add("editando");

    div.innerHTML = `
      <div class="medal ${medalClass(index)}">${index + 1}º</div>
      <div class="info">
        <div class="piloto-nome">${p.nome}</div>
        <div class="piloto-detalhe">${p.equipe}</div>
      </div>
      <div class="pts-bar-wrap">
        <div class="pts-bar-bg">
          <div class="pts-bar" style="width:${pct}%"></div>
        </div>
        <div class="pts-value">${p.pontos} pts</div>
      </div>
      <div class="acoes">
        <button class="btn-editar"
          data-id="${p.id}"
          data-nome="${encodeURIComponent(p.nome)}"
          data-equipe="${encodeURIComponent(p.equipe)}"
          data-pontos="${p.pontos}"
          title="Editar">&#9998;</button>
        <button class="btn-excluir" data-id="${p.id}" title="Excluir">&#10005;</button>
      </div>
    `;
    lista.appendChild(div);
  });

  lista.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      preencherFormulario(
        Number(btn.dataset.id),
        decodeURIComponent(btn.dataset.nome),
        decodeURIComponent(btn.dataset.equipe),
        btn.dataset.pontos
      );
    });
  });

  lista.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.addEventListener("click", () => excluir(Number(btn.dataset.id)));
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id     = document.getElementById("id").value;
  const nome   = document.getElementById("nome").value.trim();
  const equipe = document.getElementById("equipe").value.trim();
  const pontos = document.getElementById("pontos").value;

  if (!nome || !equipe || pontos === "" || Number(pontos) < 0) {
    mostrarMensagem("Preencha todos os campos corretamente.", "erro");
    return;
  }

  if (id) {
    updatePiloto(Number(id), nome, equipe, pontos);
    mostrarMensagem("Piloto atualizado! ✅");
  } else {
    createPiloto(nome, equipe, pontos);
    mostrarMensagem("Piloto cadastrado! ✅");
  }

  cancelarEdicao();
  renderizar();
});

function preencherFormulario(id, nome, equipe, pontos) {
  document.getElementById("id").value     = id;
  document.getElementById("nome").value   = nome;
  document.getElementById("equipe").value = equipe;
  document.getElementById("pontos").value = pontos;
  btnSalvar.textContent     = "Atualizar";
  btnCancelar.style.display = "inline-block";
  form.scrollIntoView({ behavior: "smooth" });
  renderizar();
}

function cancelarEdicao() {
  form.reset();
  document.getElementById("id").value = "";
  btnSalvar.textContent     = "Salvar";
  btnCancelar.style.display = "none";
}

function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir este piloto?")) return;
  if (String(document.getElementById("id").value) === String(id)) cancelarEdicao();
  deletePiloto(id);
  mostrarMensagem("Piloto excluído. 🗑️");
  renderizar();
}

renderizar();
