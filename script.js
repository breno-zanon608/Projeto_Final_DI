/* Dados de exemplo: x e y são porcentagens sobre a imagem do mapa.
   AJUSTE as posições e os textos conforme a sua pesquisa. */
const itens = [
  { id: "a1", cat: "animal", nome: "Urso Bharati (lendário)", x: 62, y: 28, desc: "Animal lendário de região montanhosa.", local: "Na clareira ao norte de O’Creagh’s Run (Grizzlies East, Ambarino)." },
  { id: "a2", cat: "animal", nome: "Tatanka (lendário)", x: 50, y: 52, desc: "Bisão lendário das planícies.", local: "Descampado Hennigan, sul do Riacho Stillwater (Nova Hanover)." },
  { id: "a3", cat: "animal", nome: "Jacaré (lendário)", x: 38, y: 33, desc: "Jacaré albino do pântano.", local: "Ao sul de Lagras, no pântano de Bayou Nwa (Lemoyne)." },


















  { id: "w1", cat: "arma", nome: "Arma de exemplo 1", x: 30, y: 60, desc: "Substitua por uma arma real do jogo.", local: "A definir" },
  { id: "w2", cat: "arma", nome: "Arma de exemplo 2", x: 72, y: 55, desc: "Substitua por uma arma real do jogo.", local: "A definir" },
  //{ id: "m1", cat: "missao", nome: "Missão perdível dos pistoleiros lendários", x: 45, y: 40, desc: "Pode ser perdida ao avançar na história.", local: "Capítulo a definir" },
  { id: "c1", cat: "cidade", nome: "Valentine", x: 52, y: 45, desc: "Cidade pecuária e ponto de partida do Capítulo 2.", local: "Heartlands" },
  { id: "c2", cat: "cidade", nome: "Saint Denis", x: 75, y: 72, desc: "Maior cidade do jogo, industrial e movimentada.", local: "Lemoyne" },
  { id: "c3", cat: "cidade", nome: "Blackwater", x: 44, y: 76, desc: "Cidade em expansão, no Capítulo 1 e no epílogo.", local: "West Elizabeth" }
];
const icone = { animal: "A", arma: "W", missao: "!", cidade: "C" };
const nomeCat = { animal: "Animal lendário", arma: "Arma", missao: "Missão perdível", cidade: "Cidade" };

const $ = (s) => document.querySelector(s);
let catAtual = "todos";
let feitos = {};
try { feitos = JSON.parse(localStorage.getItem("feitos")) || {}; } catch (e) {}

document.addEventListener("DOMContentLoaded", () => {
  /* Marcadores */
  const area = $("#mapa-area");
  itens.forEach((i) => {
    const b = document.createElement("button");
    b.className = "marcador"; b.dataset.id = i.id;
    b.style.left = i.x + "%"; b.style.top = i.y + "%";
    b.setAttribute("aria-label", `${nomeCat[i.cat]}: ${i.nome}`);
    b.innerHTML = `<span class="pin ${i.cat}"><span>${icone[i.cat]}</span></span>`;
    b.addEventListener("click", () => mostrar(i));
    area.appendChild(b);
  });

  /* Checklist */
  const lista = $("#checklist");
  itens.filter((i) => i.cat !== "cidade").forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="checkbox" data-id="${i.id}"> ${i.nome}</label>`;
    const c = li.querySelector("input");
    c.checked = !!feitos[i.id];
    c.addEventListener("change", () => {
      feitos[i.id] = c.checked;
      try { localStorage.setItem("feitos", JSON.stringify(feitos)); } catch (e) {}
      atualizar();
    });
    lista.appendChild(li);
  });

  /* Abas e pesquisa */
  document.querySelectorAll(".abas button").forEach((b) =>
    b.addEventListener("click", () => {
      catAtual = b.dataset.cat;
      document.querySelectorAll(".abas button").forEach((x) => x.setAttribute("aria-selected", x === b));
      atualizar();
    })
  );
  $("#pesquisa").addEventListener("input", atualizar);

  /* Tema claro/escuro */
  const btn = $("#tema");
  const aplicar = (t) => {
    document.documentElement.dataset.tema = t;
    btn.textContent = t === "escuro" ? "Modo claro" : "Modo escuro";
    btn.setAttribute("aria-pressed", t === "escuro");
  };
  let salvo = null;
  try { salvo = localStorage.getItem("tema"); } catch (e) {}
  aplicar(salvo || (matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro"));
  btn.addEventListener("click", () => {
    const novo = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
    aplicar(novo);
    try { localStorage.setItem("tema", novo); } catch (e) {}
  });

  /* Carrossel */
  let n = 0;
  const destaques = itens.filter((i) => i.cat === "animal" || i.cat === "missao");
  const slide = $("#slide");
  const desenhar = () => {
    const i = destaques[n];
    slide.innerHTML = `<img src="images/${i.id}.jpg" alt="Imagem de ${i.nome}" width="480" height="300">
      <div><h3>${i.nome}</h3><p>${i.desc}</p><p><strong>Local:</strong> ${i.local}</p></div>`;
  };
  $("#ant").addEventListener("click", () => { n = (n - 1 + destaques.length) % destaques.length; desenhar(); });
  $("#prox").addEventListener("click", () => { n = (n + 1) % destaques.length; desenhar(); });
  desenhar();

  /* Formulário (demonstração, sem servidor) */
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#retorno").textContent = "Mensagem enviada com sucesso. Obrigado pelo contato!";
    e.target.reset();
  });

  atualizar();
});

function mostrar(i) {
  $("#info").innerHTML = `<h3>${i.nome}</h3><p><strong>${nomeCat[i.cat]}</strong></p>
    <p>${i.desc}</p><p><strong>Localização:</strong> ${i.local}</p>`;
}

function atualizar() {
  const q = $("#pesquisa").value.trim().toLowerCase();
  itens.forEach((i) => {
    const ok = (catAtual === "todos" || i.cat === catAtual) && i.nome.toLowerCase().includes(q);
    const m = document.querySelector(`.marcador[data-id="${i.id}"]`);
    m.hidden = !ok;
    m.classList.toggle("feito", !!feitos[i.id]);
  });
  const lista = itens.filter((i) => i.cat !== "cidade");
  const feitosN = lista.filter((i) => feitos[i.id]).length;
  $("#progresso").textContent = `${feitosN} de ${lista.length} concluídos`;
}
