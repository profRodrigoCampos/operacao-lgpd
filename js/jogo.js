/* =========================================================
   OPERAÇÃO LGPD — lógica do jogo (100% front-end)
   ========================================================= */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rnd = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const carta = (id) => CARTAS.find((x) => x.id === id);

  const SAVE_KEY = "operacaoLGPD_v2";
  const TEMPO = 30, TEMPO_AUDITORIA = 15, TEMPO_ROUBO = 15, MAO_MAX = 4, FIM = TABULEIRO.length - 1;
  const COR_CASA = { P: "var(--green)", V: "var(--cyan)", D: "var(--violet)", C: "var(--amber)", X: "var(--red)", F: "var(--amber)" };
  const COR_JOG = ["var(--p1)", "var(--p2)"];

  let S = null; // estado da partida
  const ui = { timer: null, manualAberto: false, ocupado: false, pts: [null, null], perguntaAtiva: false };

  /* ---------------- Persistência (só neste navegador) ---------------- */
  function salvar() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* sem storage: segue o jogo */ } }
  function carregar() { try { const t = localStorage.getItem(SAVE_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
  function limparSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  /* ---------------- Navegação ---------------- */
  function tela(id) {
    document.querySelectorAll(".tela").forEach((t) => t.classList.toggle("ativa", t.id === id));
    window.scrollTo(0, 0);
    const el = $("#top-actions");
    if (id === "tela-jogo") {
      el.innerHTML = `<button class="btn btn-ghost" data-a="manual">📖 Manual do Detetive</button>
        <button class="btn btn-ghost" data-a="regras">? Regras</button>
        <button class="btn btn-ghost btn-red" data-a="encerrar">⏻ Encerrar</button>`;
    } else if (id === "tela-dossie") {
      el.innerHTML = `<button class="btn btn-ghost" data-a="manual">📖 Ver todas as fichas</button>`;
    } else el.innerHTML = "";
  }
  $("#top-actions").addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a;
    if (a === "manual") abrirManual(1);
    if (a === "regras") mostrarRegras();
    if (a === "encerrar") confirmarEncerrar();
  });

  /* ---------------- Modal ---------------- */
  function abrirModal(html, cor) {
    const box = $("#modal-box");
    box.classList.remove("urgente");
    box.style.setProperty("--cc", cor || "var(--green)");
    box.innerHTML = html;
    $("#modal").classList.add("aberto");
    box.scrollTop = 0;
  }
  function fecharModal() { $("#modal").classList.remove("aberto"); $("#modal-box").innerHTML = ""; $("#modal-box").classList.remove("urgente"); }

  /* ---------------- Tela inicial ---------------- */
  const INTRO = [
    ["p", "> conexão segura estabelecida ............ [OK]"],
    ["", "> ONTEM, 03h17: 2,3 milhões de cadastros da BauruByte Delivery apareceram à venda num fórum da dark web."],
    ["r", "> Vazaram: nomes, CPFs, endereços, histórico de pedidos e até as ALERGIAS ALIMENTARES dos clientes."],
    ["a", "> A ANPD foi acionada. Vocês são os detetives cibernéticos do caso."],
    ["", "> Leiam o dossiê, sigam as pistas pelo tabuleiro e não errem."],
    ["p", "> Só um nome assina o relatório final: quem tiver MAIS PONTOS."]
  ];
  function digitarIntro() {
    const el = $("#intro-terminal");
    let li = 0, ci = 0, pulou = false;
    const render = (parcial) => {
      let h = "";
      for (let i = 0; i < li; i++) h += `<div class="${INTRO[i][0]}">${esc(INTRO[i][1])}</div>`;
      if (li < INTRO.length) h += `<div class="${INTRO[li][0]}">${esc(parcial)}<span class="cursor"></span></div>`;
      else h += '<div><span class="cursor"></span></div>';
      el.innerHTML = h;
    };
    el.onclick = () => { pulou = true; li = INTRO.length; render(""); };
    const tick = () => {
      if (pulou || li >= INTRO.length) return render("");
      const linha = INTRO[li][1];
      ci++;
      render(linha.slice(0, ci));
      if (ci >= linha.length) { li++; ci = 0; setTimeout(tick, 220); }
      else setTimeout(tick, 14);
    };
    tick();
  }

  function initInicio() {
    digitarIntro();
    FX.chuva($("#chuva"));
    const salvo = carregar();
    const bc = $("#btn-continuar");
    if (salvo && salvo.players) {
      bc.classList.remove("hidden");
      bc.textContent = `⟳ Continuar: ${salvo.players[0].nome} vs ${salvo.players[1].nome}`;
      bc.onclick = () => retomar(salvo);
    }
    $("#form-cadastro").addEventListener("submit", (e) => {
      e.preventDefault();
      const n1 = $("#nome1").value.trim(), n2 = $("#nome2").value.trim();
      if (!n1 || !n2) return;
      if (n1.toLowerCase() === n2.toLowerCase()) { alert("Os dois agentes precisam ter nomes diferentes."); return; }
      novoEstado(n1, n2);
      S.fase = "dossie"; S.fichaIdx = 0; salvar();
      abrirDossie();
    });
  }

  function novoJogador(nome) {
    return { nome, pos: 0, pts: 0, mao: [], acertos: 0, erros: 0, errosFicha: {}, dobro: false, chegou: false, seq: 0, pulaVez: false, auditoria: false };
  }
  function montarBaralho() {
    const d = [];
    CARTAS.forEach((c) => { for (let i = 0; i < c.qtd; i++) d.push(c.id); });
    return shuffle(d);
  }
  function novoEstado(n1, n2) {
    const ataques = CARTAS.filter((c) => c.tipo === "ataque").map((c) => c.id);
    const j1 = novoJogador(n1), j2 = novoJogador(n2);
    // cada agente já começa com 1 carta de ataque
    j1.mao.push(ataques[rnd(ataques.length)]);
    j2.mao.push(ataques[rnd(ataques.length)]);
    S = {
      v: 2, players: [j1, j2], turn: rnd(2),
      deck: montarBaralho(), used: { G: [], V: [], D: [] }, cartaJogada: false,
      endAfter: null, firstArrived: null, log: [], inicio: Date.now(), fase: "dossie", fichaIdx: 0
    };
  }

  function retomar(salvo) {
    S = salvo;
    if (S.fase === "dossie") abrirDossie();
    else if (S.fase === "jogo") abrirJogo(false);
    else if (S.fase === "fim") mostrarFim();
    else tela("tela-inicio");
  }

  /* ---------------- Dossiê ---------------- */
  function fichaHTML(f) {
    return `<div class="tag">FICHA ${f.id}/${FICHAS.length} // ${esc(f.tag)}</div>
      <h3>${esc(f.titulo)}</h3>
      ${f.html}
      <div class="ficha-boxes">
        <div class="box dia"><span class="lbl">▸ NO DIA A DIA</span>${esc(f.diaadia)}</div>
        <div class="box dev"><span class="lbl">▸ PARA QUEM PROGRAMA</span>${esc(f.dev)}</div>
      </div>`;
  }
  function abrirDossie() { tela("tela-dossie"); renderDossie(); }
  function renderDossie() {
    const i = S.fichaIdx, f = FICHAS[i];
    $("#dossie-titulo").textContent = `${S.players[0].nome} & ${S.players[1].nome}: estudem o caso`;
    $("#dossie-count").textContent = `${i + 1}/${FICHAS.length}`;
    $("#dossie-prog").style.width = `${((i + 1) / FICHAS.length) * 100}%`;
    $("#dossie-ficha").innerHTML = fichaHTML(f);
    $("#dossie-prev").disabled = i === 0;
    $("#dossie-next").textContent = i === FICHAS.length - 1 ? "ABRIR O TABULEIRO >" : "próxima ficha >";
  }
  $("#dossie-prev").onclick = () => { if (S.fichaIdx > 0) { S.fichaIdx--; salvar(); renderDossie(); window.scrollTo(0, 0); } };
  $("#dossie-next").onclick = () => {
    if (S.fichaIdx < FICHAS.length - 1) { S.fichaIdx++; salvar(); renderDossie(); window.scrollTo(0, 0); }
    else abrirJogo(true);
  };

  /* ---------------- Manual do Detetive (o tempo NÃO pausa) ---------------- */
  function abrirManual(id) {
    ui.manualAberto = true;
    $("#manual-nav").innerHTML = FICHAS.map((f) => `<button data-f="${f.id}">${f.id}. ${esc(f.titulo)}</button>`).join("");
    mostrarFichaManual(id || 1);
    $("#manual").classList.add("aberto");
  }
  function mostrarFichaManual(id) {
    const f = FICHAS.find((x) => x.id === id) || FICHAS[0];
    $("#manual-ficha").innerHTML = fichaHTML(f);
    $("#manual-ficha").scrollTop = 0;
    document.querySelectorAll("#manual-nav button").forEach((b) => b.classList.toggle("ativo", +b.dataset.f === f.id));
  }
  function fecharManual() { $("#manual").classList.remove("aberto"); ui.manualAberto = false; }
  $("#manual-nav").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) mostrarFichaManual(+b.dataset.f); });
  $("#manual-fechar").onclick = fecharManual;

  /* ---------------- Regras ---------------- */
  function mostrarRegras(cb) {
    const t = TIPOS_CASA;
    abrirModal(`
      <div class="m-head"><div class="m-tipo">📋 REGRAS DA INVESTIGAÇÃO</div></div>
      <ul class="regras">
        <li>Na sua vez, <b>role o dado</b> e avance. A casa onde você parar traz um desafio:</li>
        <li><span class="sw" style="color:var(--green)">${t.P.icone}</span><b>PISTA</b>: pergunta sobre conceitos (+10) &nbsp; <span class="sw" style="color:var(--cyan)">${t.V.icone}</span><b>INTERROGATÓRIO</b>: verdadeiro ou falso (+10)</li>
        <li><span class="sw" style="color:var(--violet)">${esc(t.D.icone)}</span><b>CÓDIGO</b>: desafio de programador (+20) &nbsp; <span class="sw" style="color:var(--red)">${t.X.icone}</span><b>VAZAMENTO</b>: acertou +15, errou <b>−10 e volta 3</b></li>
        <li><span class="sw" style="color:var(--amber)">${t.C.icone}</span><b>CARTA</b>: ganhe uma <b>carta-poder</b>. 🔥 <b>COMBO</b>: a cada <b>2 acertos seguidos</b> você também ganha uma!</li>
        <li>⚔ Cada agente <b>começa com 1 carta de ataque</b>. As cartas ficam na sua mão (máx. ${MAO_MAX}). Na sua vez, <b>ANTES de rolar o dado</b>, clique na carta no seu painel para jogá-la no rival. Pode jogar <b>quantas quiser</b> na mesma rodada! O ⛨ Escudo bloqueia ataques sozinho.</li>
        <li>⏱ Cada pergunta tem <b>30 segundos</b>. Responder rápido dá <b>até +5 de bônus</b>. Errou ou o tempo acabou? <b>Volte 1 casa</b>.</li>
        <li>📖 O <b>Manual do Detetive</b> pode ser aberto quando quiserem, <b>mas o tempo CONTINUA correndo!</b></li>
        <li>↩ Voltar ou avançar por penalidade ou carta <b>não</b> ativa a casa onde você parar.</li>
        <li>🛣 O caminho começa no <b>INÍCIO</b> (canto superior esquerdo) e segue as <b>setas</b> e os <b>números</b> das casas, em zigue-zague, até o <b>FIM ⚑</b> (canto inferior esquerdo).</li>
        <li>⚑ Quem chegar primeiro ao <b>FIM</b> ganha <b>+30</b>, e o rival tem <b>uma última vez</b>, sempre com pergunta (se chegar também, ganha +15).</li>
        <li>🏆 <b>Vence quem tiver MAIS PONTOS</b>, não quem chegar primeiro!</li>
      </ul>
      <div class="m-acoes"><div class="dir"><button class="btn btn-primary btn-big" id="regras-ok">ENTENDI. BORA! &gt;</button></div></div>`, "var(--cyan)");
    $("#regras-ok").onclick = () => { fecharModal(); if (cb) cb(); };
  }

  /* ---------------- Jogo: montagem ---------------- */
  function abrirJogo(primeiraVez) {
    S.fase = "jogo";
    tela("tela-jogo");
    montarTabuleiro();
    ui.pts = [null, null];
    ui.ocupado = false;
    renderTudo();
    $("#btn-dado").disabled = false;
    if (primeiraVez) {
      if (!S.log.length) logar(`Partida iniciada. ${S.players[S.turn].nome} foi sorteado(a) para começar.`, S.turn);
      salvar();
      mostrarRegras(() => FX.turno(esc(S.players[S.turn].nome), COR_JOG[S.turn]));
    }
  }

  function montarTabuleiro() {
    const tb = $("#tabuleiro");
    tb.innerHTML = "";
    const coord = (i) => { const row = Math.floor(i / 8), ci = i % 8; return { row, col: row % 2 === 0 ? ci : 7 - ci }; };
    TABULEIRO.forEach((tipo, i) => {
      const info = TIPOS_CASA[tipo];
      const { row, col } = coord(i);
      // seta indicando para onde o caminho segue
      let seta = "";
      if (i < FIM) {
        const nx = coord(i + 1);
        const dir = nx.row > row ? "baixo" : nx.col > col ? "dir" : "esq";
        seta = `<span class="seta seta-${dir}">${dir === "baixo" ? "▼" : dir === "dir" ? "▶" : "◀"}</span>`;
      }
      const d = document.createElement("div");
      d.className = `casa ${info.cls}`;
      d.id = `casa-${i}`;
      d.style.gridRow = row + 1;
      d.style.gridColumn = col + 1;
      d.title = info.desc || info.nome;
      d.innerHTML = `${i > 0 && i < FIM ? `<span class="n">${i}</span>` : ""}
        <span class="ic">${esc(info.icone)}</span><span class="nm">${info.nome}</span><span class="tokens"></span>${seta}`;
      tb.appendChild(d);
    });
    $("#legenda").innerHTML = ["P", "V", "D", "X", "C"].map((k) =>
      `<span><b style="color:${COR_CASA[k]}">${esc(TIPOS_CASA[k].icone)}</b>${TIPOS_CASA[k].desc}</span>`).join("");
  }

  function renderTokens() {
    document.querySelectorAll(".casa .tokens").forEach((t) => (t.innerHTML = ""));
    S.players.forEach((p, i) => {
      const c = document.querySelector(`#casa-${p.pos} .tokens`);
      if (c) c.insertAdjacentHTML("beforeend", `<span class="token t${i}" title="${esc(p.nome)}"></span>`);
    });
  }
  function destacar(pos) {
    document.querySelectorAll(".casa.destaque").forEach((c) => c.classList.remove("destaque"));
    const c = $(`#casa-${pos}`); if (c && pos > 0) c.classList.add("destaque");
  }
  function pulsarCasa(pos, cls) {
    const c = $(`#casa-${pos}`); if (!c) return;
    c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls);
  }

  /* condições para jogar uma carta da mão */
  function podeJogar(i, id) {
    const c = carta(id), p = S.players[i], rival = S.players[1 - i];
    if (!c || S.fase !== "jogo" || S.turn !== i || ui.ocupado || p.chegou) return false;
    if (c.tipo === "buff") return !p.dobro;
    if (c.tipo !== "ataque") return false;
    if (rival.chegou) return false;
    if (c.id === "engenharia") return rival.mao.length > 0;
    if (c.id === "ransom") return rival.pos > 0;
    if (c.id === "ddos") return !rival.pulaVez;
    if (c.id === "auditoria") return !rival.auditoria;
    return true;
  }

  function renderPainel(i) {
    const p = S.players[i];
    const total = p.acertos + p.erros;
    const taxa = total ? Math.round((p.acertos / total) * 100) + "%" : "—";
    const casa = p.pos === 0 ? "INÍCIO" : p.pos >= FIM ? "FIM" : `${p.pos}/${FIM - 1}`;
    const cartas = p.mao.length
      ? p.mao.map((id, k) => {
          const c = carta(id); if (!c) return "";
          const pode = podeJogar(i, id);
          const tag = c.tipo === "passiva" ? "passiva" : pode ? "JOGAR ▶" : (c.tipo === "ataque" ? "ataque" : "bônus");
          return `<button class="carta-mini ${c.tipo}${pode ? " pode" : ""}" data-p="${i}" data-k="${k}" ${pode ? "" : "disabled"} title="${esc(c.texto)}">
            <span class="ic">${esc(c.icone)}</span><span class="cm-nm">${esc(c.nome)}</span><span class="cm-tag">${tag}</span></button>`;
        }).join("")
      : '<span class="dim small">nenhuma</span>';
    const status = [
      p.seq >= 1 ? `🔥 sequência: ${p.seq}` : "",
      p.dobro ? "×2 próxima pergunta vale o dobro" : "",
      p.auditoria ? "⏱ próxima pergunta: só 15s" : "",
      p.pulaVez ? "⌁ vai perder a próxima vez" : "",
      p.chegou ? "⚑ relatório entregue" : ""
    ].filter(Boolean).map((s) => `<div>${s}</div>`).join("");
    const el = $(`#painel-${i}`);
    el.className = `painel-jogador p${i}${S.turn === i && S.fase === "jogo" ? " ativo" : ""}`;
    el.innerHTML = `
      <div class="pj-head"><div class="pj-token"></div><div><div class="pj-label">AGENTE 0${i + 1}</div><div class="pj-nome">${esc(p.nome)}</div></div></div>
      <div><div class="pj-label">PONTOS</div><div class="pj-pontos">${p.pts}<small> pts</small></div></div>
      <div class="pj-stats">
        <div>casa <b>${casa}</b></div><div>taxa <b>${taxa}</b></div>
        <div>acertos <b>${p.acertos}</b></div><div>erros <b>${p.erros}</b></div>
      </div>
      <div><div class="pj-label">CARTAS-PODER (${p.mao.length}/${MAO_MAX})</div><div class="pj-cartas">${cartas}</div></div>
      <div class="pj-status">${status}</div>`;
    // animação quando a pontuação muda
    const prev = ui.pts[i];
    if (prev !== null && prev !== p.pts) {
      const diff = p.pts - prev;
      const pe = el.querySelector(".pj-pontos");
      pe.classList.add(diff > 0 ? "bump" : "bump-neg");
      FX.float(pe, (diff > 0 ? "+" : "") + diff, diff > 0 ? "var(--green)" : "var(--red)");
    }
    ui.pts[i] = p.pts;
  }
  function renderPaineis() { renderPainel(0); renderPainel(1); }
  function renderVez() {
    const p = S.players[S.turn];
    const ultima = S.endAfter === S.turn;
    const temAtaque = p.mao.some((id) => podeJogar(S.turn, id));
    $("#vez").innerHTML = `<div class="lbl">${ultima ? "⚠ ÚLTIMA CHANCE" : "VEZ DO AGENTE"}</div>
      <div class="nome" style="color:${COR_JOG[S.turn]}">${esc(p.nome)}</div>
      <div class="hint">${ultima ? "O rival já chegou ao FIM. Última jogada: role o dado e responda!"
        : temAtaque ? "⚔ Você pode jogar uma carta no rival antes de rolar!" : "Clique em ROLAR DADO (ou aperte a barra de espaço)"}</div>`;
  }
  function renderLog() {
    $("#log").innerHTML = S.log.map((l) => `<div class="${l.w != null ? "l" + l.w : ""}">${esc(l.m)}</div>`).join("");
  }
  function renderTudo() { renderTokens(); renderPaineis(); renderVez(); renderLog(); destacar(-1); }
  function logar(m, w) { S.log.unshift({ m, w }); S.log = S.log.slice(0, 60); renderLog(); }

  function travar() { ui.ocupado = true; $("#btn-dado").disabled = true; renderPaineis(); }
  function liberar() { ui.ocupado = false; $("#btn-dado").disabled = false; renderTudo(); salvar(); }

  /* ---------------- Jogar carta-poder no rival ---------------- */
  document.querySelector(".jogo-wrap").addEventListener("click", (e) => {
    const b = e.target.closest(".carta-mini[data-k]");
    if (!b || b.disabled) return;
    confirmarCarta(+b.dataset.p, +b.dataset.k);
  });

  function confirmarCarta(pi, k) {
    const p = S.players[pi], rival = S.players[1 - pi], c = carta(p.mao[k]);
    if (!podeJogar(pi, c.id)) return;
    const alvo = c.tipo === "ataque" ? `Alvo: <b style="color:${COR_JOG[1 - pi]}">${esc(rival.nome)}</b>` : "Efeito em você";
    abrirModal(`
      <div class="m-head"><div class="m-tipo">⚔ JOGAR CARTA-PODER?</div><div class="m-quem">${alvo}</div></div>
      <div class="carta-grande ${c.tipo}">
        <div class="ic">${esc(c.icone)}</div><div class="nm">${esc(c.nome)}</div>
        <div class="tx">${esc(c.texto)}</div><div class="lore">"${esc(c.lore)}"</div>
      </div>
      ${c.tipo === "ataque" && rival.mao.includes("escudo") ? '<p class="dim small" style="text-align:center">⚠ Cuidado: o rival tem um ESCUDO na mão...</p>' : ""}
      <div class="m-acoes"><button class="btn btn-ghost" id="cj-nao">Guardar para depois</button>
      <div class="dir"><button class="btn btn-red btn-big" id="cj-sim">${c.tipo === "ataque" ? "⚔ ATACAR!" : "JOGAR!"}</button></div></div>`,
      c.tipo === "ataque" ? "var(--red)" : "var(--amber)");
    $("#cj-nao").onclick = fecharModal;
    $("#cj-sim").onclick = () => { fecharModal(); jogarCarta(pi, k); };
  }

  function jogarCarta(pi, k) {
    const p = S.players[pi], ri = 1 - pi, rival = S.players[ri];
    const c = carta(p.mao[k]);
    p.mao.splice(k, 1);
    S.cartaJogada = true;
    travar();

    if (c.tipo === "buff") {
      p.dobro = true;
      logar(`${p.nome} jogou DOBRO OU NADA.`, pi);
      return FX.banner({ icone: c.icone, titulo: "DOBRO OU NADA", sub: `A próxima pergunta de <b>${esc(p.nome)}</b> vale ×2`, cor: "var(--amber)" }, liberar);
    }

    // ataque bloqueado pelo escudo
    if (rival.mao.includes("escudo")) {
      rival.mao.splice(rival.mao.indexOf("escudo"), 1);
      logar(`${p.nome} jogou ${c.nome}, mas o ESCUDO de ${rival.nome} bloqueou!`, pi);
      return FX.ataque(c, esc(rival.nome), "", true, liberar);
    }

    let resultado = "", depois = liberar;
    switch (c.id) {
      case "ransom":
        resultado = `${rival.nome} volta 3 casas!`;
        depois = () => mover(ri, -3, liberar);
        break;
      case "phishing": {
        const perda = Math.min(10, rival.pts);
        rival.pts -= perda;
        resultado = `${rival.nome} perde ${perda} pontos!`;
        break;
      }
      case "ddos":
        rival.pulaVez = true;
        resultado = `${rival.nome} vai perder a próxima vez!`;
        break;
      case "auditoria":
        rival.auditoria = true;
        resultado = `A próxima pergunta de ${rival.nome} terá só ${TEMPO_AUDITORIA}s!`;
        break;
      case "engenharia": {
        const j = rnd(rival.mao.length);
        const roubada = rival.mao.splice(j, 1)[0];
        if (p.mao.length < MAO_MAX) p.mao.push(roubada); else p.pts += 5;
        resultado = `${p.nome} roubou a carta ${carta(roubada).nome} de ${rival.nome}!`;
        break;
      }
    }
    logar(`${p.nome} jogou ${c.nome}: ${resultado}`, pi);
    FX.ataque(c, esc(rival.nome), esc(resultado), false, () => { renderPaineis(); depois(); });
  }

  /* ---------------- Dado e movimento ---------------- */
  function rolar() {
    if (ui.ocupado || S.fase !== "jogo") return;
    travar();
    const d = $("#dado");
    d.classList.remove("saiu");
    d.classList.add("rolando");
    let n = 0;
    const it = setInterval(() => {
      d.textContent = 1 + rnd(6);
      if (++n >= 12) {
        clearInterval(it);
        const v = 1 + rnd(6);
        d.textContent = v;
        d.classList.remove("rolando");
        void d.offsetWidth; d.classList.add("saiu");
        FX.burstEl(d, "var(--green)", 16, "0123456789");
        const pi = S.turn;
        logar(`${S.players[pi].nome} tirou ${v} no dado.`, pi);
        mover(pi, v, () => aoCair(pi));
      }
    }, 70);
  }
  $("#btn-dado").onclick = rolar;
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && S && S.fase === "jogo" && !$("#modal").classList.contains("aberto") && !ui.manualAberto && document.activeElement.tagName !== "INPUT") {
      e.preventDefault(); rolar();
    }
  });

  function mover(pi, n, cb) {
    const p = S.players[pi], dir = n > 0 ? 1 : -1;
    let falta = Math.abs(n);
    const passo = () => {
      if (falta === 0 || (dir > 0 && p.pos >= FIM) || (dir < 0 && p.pos <= 0)) {
        destacar(p.pos); pulsarCasa(p.pos, "pousou"); renderPaineis();
        return setTimeout(cb, 380);
      }
      p.pos += dir; falta--;
      renderTokens(); destacar(p.pos); pulsarCasa(p.pos, "pisou");
      setTimeout(passo, 230);
    };
    passo();
  }

  function aoCair(pi) {
    const p = S.players[pi];
    if (p.pos >= FIM) return chegada(pi, fimDoTurno);
    const tipo = TABULEIRO[p.pos];
    // última chance: carta não serve mais para nada, então vira uma pergunta garantida
    if (tipo === "C" && S.endAfter === pi) {
      return FX.banner({ icone: "⚠", titulo: "ÚLTIMA CHANCE", sub: "Na jogada final, a casa de carta vira uma <b>PERGUNTA</b>!", cor: "var(--amber)", ms: 1500 },
        () => iniciarPergunta(pi, "P"));
    }
    if (tipo === "C") return comprarCarta(pi, null, fimDoTurno);
    if (tipo === "X") return FX.alerta(() => iniciarPergunta(pi, tipo));
    if (tipo === "P" || tipo === "V" || tipo === "D") return iniciarPergunta(pi, tipo);
    fimDoTurno();
  }

  /* ---------------- Perguntas ---------------- */
  function sortear(pool) {
    const total = PERGUNTAS[pool].length;
    let livres = [];
    for (let i = 0; i < total; i++) if (!S.used[pool].includes(i)) livres.push(i);
    if (!livres.length) { S.used[pool] = []; livres = [...Array(total).keys()]; }
    const idx = livres[rnd(livres.length)];
    S.used[pool].push(idx);
    return idx;
  }
  const tem = (p, id) => p.mao.includes(id);
  const usar = (p, id) => { const k = p.mao.indexOf(id); if (k >= 0) p.mao.splice(k, 1); };
  const bonusTempo = (r, total) => Math.max(0, Math.min(5, Math.floor((r / total) * 6)));

  function iniciarPergunta(pi, casaTipo) {
    const p = S.players[pi];
    const pool = casaTipo === "P" ? "G" : casaTipo === "V" ? "V" : casaTipo === "D" ? "D" : (Math.random() < 0.5 ? "G" : "D");
    const q = PERGUNTAS[pool][sortear(pool)];
    let tempo = TEMPO, auditoria = false;
    if (p.auditoria) { p.auditoria = false; tempo = TEMPO_AUDITORIA; auditoria = true; renderPaineis(); }
    mostrarPergunta({ pi, pool, q, casaTipo, tempo, auditoria, roubo: false, excluir: null },
      (res) => resolverPergunta(pi, casaTipo, pool, q, res));
  }

  function mostrarPergunta(ctx, cb) {
    const { pi, pool, q, casaTipo } = ctx;
    const p = S.players[pi];
    const info = TIPOS_CASA[casaTipo];
    const vf = pool === "V";
    let opcoesHTML;
    if (vf) {
      opcoesHTML = `<div class="opcoes vf">
        <button class="opcao" data-v="true"><span>✓ VERDADEIRO</span></button>
        <button class="opcao" data-v="false"><span>✗ FALSO</span></button></div>`;
    } else {
      const ordem = shuffle([0, 1, 2, 3]);
      opcoesHTML = `<div class="opcoes">${ordem.map((oi, k) =>
        `<button class="opcao${ctx.excluir === oi ? " eliminada" : ""}" data-i="${oi}"${ctx.excluir === oi ? " disabled" : ""}>
          <span class="k">${"ABCD"[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("")}</div>`;
    }
    const podeDica = !vf && !ctx.roubo && tem(p, "dica");
    const tags = [
      p.dobro && !ctx.roubo ? '<span style="color:var(--amber)">×2 DOBRO OU NADA</span>' : "",
      ctx.auditoria ? '<span style="color:var(--violet)">⏱ AUDITORIA: só 15s!</span>' : ""
    ].filter(Boolean).join(" · ");
    abrirModal(`
      <div class="m-head">
        <div>
          <div class="m-tipo">${esc(info.icone)} ${ctx.roubo ? "ROUBO DE PISTA" : info.nome}</div>
          <div class="m-quem" style="--pc:${COR_JOG[pi]}">${ctx.roubo ? "tentativa de roubo de" : "vez de"} <b>${esc(p.nome)}</b>${tags ? " · " + tags : ""}</div>
        </div>
        <div class="timer" id="timer">${ctx.tempo}</div>
      </div>
      <div class="timer-bar"><div id="timer-bar" style="width:100%"></div></div>
      <p class="pergunta">${esc(q.q)}</p>
      ${opcoesHTML}
      <div class="m-acoes">
        <button class="btn btn-ghost" id="q-manual">📖 Manual (o tempo continua!)</button>
        <div class="dir">${podeDica ? '<button class="btn btn-amber" id="q-dica">☏ Usar Dica do DPO</button>' : ""}</div>
      </div>`, COR_CASA[casaTipo]);

    let restante = ctx.tempo, respondido = false;
    const box = $("#modal-box"), tEl = $("#timer"), bEl = $("#timer-bar"), mt = $("#manual-timer");
    ui.perguntaAtiva = true;
    const atualizar = () => {
      const s = Math.ceil(restante);
      tEl.textContent = s;
      tEl.className = "timer" + (restante <= 8 ? " alerta" : "");
      bEl.style.width = `${(restante / ctx.tempo) * 100}%`;
      box.classList.toggle("urgente", restante <= 5 && !respondido);
      mt.textContent = `⏱ ${s}s`;
      mt.classList.toggle("alerta", restante <= 8);
    };
    atualizar();
    clearInterval(ui.timer);
    ui.timer = setInterval(() => {
      restante -= 0.1; // o tempo corre mesmo com o manual aberto
      if (restante <= 0) { restante = 0; atualizar(); responder(null); return; }
      atualizar();
    }, 100);

    const responder = (escolha) => {
      if (respondido) return;
      respondido = true;
      clearInterval(ui.timer);
      ui.perguntaAtiva = false;
      mt.textContent = "";
      fecharManual();
      box.classList.remove("urgente");
      const acertou = escolha !== null && (vf ? escolha === String(q.a) : escolha === 0);
      let btnEscolhido = null;
      document.querySelectorAll("#modal-box .opcao").forEach((b) => {
        b.disabled = true;
        const val = vf ? b.dataset.v : +b.dataset.i;
        // marca só a escolhida (não revela a correta: pode haver roubo)
        if (escolha !== null && val === escolha) { b.classList.add(acertou ? "certa" : "errada"); btnEscolhido = b; }
      });
      if (escolha === null) tEl.textContent = "0";
      const dc = $("#q-dica"); if (dc) dc.disabled = true;
      if (acertou) {
        FX.flash("var(--green)");
        if (btnEscolhido) FX.burstEl(btnEscolhido, "var(--green)", 30, "01✓");
      } else {
        FX.flash("var(--red)");
        FX.shake();
        if (btnEscolhido) FX.burstEl(btnEscolhido, "var(--red)", 18, "✗x");
      }
      setTimeout(() => cb({ acertou, escolha, restante, tempoTotal: ctx.tempo, timeout: escolha === null }), 950);
    };

    document.querySelectorAll("#modal-box .opcao").forEach((b) => {
      b.onclick = () => responder(vf ? b.dataset.v : +b.dataset.i);
    });
    $("#q-manual").onclick = () => abrirManual(q.f);
    const dc = $("#q-dica");
    if (dc) dc.onclick = () => {
      usar(p, "dica");
      const erradas = shuffle([1, 2, 3].filter((i) => i !== ctx.excluir)).slice(0, 2);
      erradas.forEach((i) => {
        const b = document.querySelector(`#modal-box .opcao[data-i="${i}"]`);
        if (b) { b.classList.add("eliminada"); b.disabled = true; FX.burstEl(b, "var(--amber)", 10, "☏"); }
      });
      dc.remove();
      renderPaineis();
      logar(`${p.nome} usou a DICA DO DPO.`, pi);
    };
  }

  function resolverPergunta(pi, casaTipo, pool, q, res) {
    const p = S.players[pi], ri = 1 - pi, rival = S.players[ri];
    const base = TIPOS_CASA[casaTipo].pts;
    const efeitos = [];
    let recuo = 0;

    if (res.acertou) {
      const bt = bonusTempo(res.restante, res.tempoTotal || TEMPO);
      let pts = base + bt;
      let txt = `+${pts} pontos (${base} da casa + ${bt} de rapidez)`;
      if (p.dobro) { pts *= 2; txt = `+${pts} pontos (${base} + ${bt} de rapidez, ×2 DOBRO OU NADA)`; p.dobro = false; }
      p.pts += pts; p.acertos++;
      p.seq = (p.seq || 0) + 1;
      efeitos.push({ c: "mais", t: txt });
      const combo = p.seq % 2 === 0;
      if (combo) efeitos.push({ c: "neutro", t: `🔥 COMBO! ${p.seq} acertos seguidos: você ganha uma carta-poder!` });
      logar(`${p.nome} acertou (${TIPOS_CASA[casaTipo].nome}) e ganhou +${pts}.`, pi);
      return mostrarFeedback(pi, q, pool, true, res.timeout, efeitos, 0, combo);
    }

    // errou
    p.erros++;
    p.seq = 0;
    p.errosFicha[q.f] = (p.errosFicha[q.f] || 0) + 1;
    if (p.dobro) { p.dobro = false; efeitos.push({ c: "neutro", t: "DOBRO OU NADA... ficou no nada!" }); }
    if (casaTipo === "X") {
      if (tem(p, "escudo")) {
        usar(p, "escudo");
        efeitos.push({ c: "neutro", t: "⛨ O ESCUDO DE CRIPTOGRAFIA bloqueou a penalidade do vazamento!" });
      } else {
        const perda = Math.min(10, p.pts);
        p.pts -= perda;
        recuo = 3;
        efeitos.push({ c: "menos", t: `Vazamento não contido: −${perda} pontos e volta 3 casas.` });
      }
    } else {
      recuo = 1;
      efeitos.push({ c: "menos", t: "Pista falsa: volte 1 casa." });
    }
    logar(`${p.nome} ${res.timeout ? "deixou o tempo acabar" : "errou"} (${TIPOS_CASA[casaTipo].nome}).`, pi);

    const seguir = () => mostrarFeedback(pi, q, pool, false, res.timeout, efeitos, recuo, false);

    if (pool !== "V" && tem(rival, "roubar")) {
      abrirModal(`
        <div class="m-head"><div class="m-tipo">⇄ ROUBAR A PISTA?</div></div>
        <p class="pergunta"><b style="color:${COR_JOG[ri]}">${esc(rival.nome)}</b>, você tem a carta <b>ROUBAR A PISTA</b>.
        ${esc(p.nome)} ${res.timeout ? "deixou o tempo acabar" : "errou"}. Quer responder a mesma pergunta (${TEMPO_ROUBO}s) e ficar com <b>+${base} pontos</b>?</p>
        <p class="dim small">Se usar, a carta é descartada mesmo que você erre. Errar no roubo não tira pontos.</p>
        <div class="m-acoes"><button class="btn btn-ghost" id="r-nao">Não, guardar a carta</button>
        <div class="dir"><button class="btn btn-amber btn-big" id="r-sim">SIM, ROUBAR!</button></div></div>`, "var(--amber)");
      $("#r-nao").onclick = seguir;
      $("#r-sim").onclick = () => {
        usar(rival, "roubar");
        renderPaineis();
        mostrarPergunta({ pi: ri, pool, q, casaTipo, tempo: TEMPO_ROUBO, roubo: true, excluir: typeof res.escolha === "number" ? res.escolha : null }, (r2) => {
          if (r2.acertou) {
            rival.pts += base; rival.acertos++;
            efeitos.push({ c: "mais", t: `⇄ ${rival.nome} ROUBOU a pista: +${base} pontos para ${rival.nome}!` });
            logar(`${rival.nome} roubou a pista e ganhou +${base}.`, ri);
          } else {
            efeitos.push({ c: "neutro", t: `⇄ ${rival.nome} tentou roubar, mas também errou.` });
            logar(`${rival.nome} tentou roubar a pista e errou.`, ri);
          }
          seguir();
        });
      };
      return;
    }
    seguir();
  }

  function mostrarFeedback(pi, q, pool, acertou, timeout, efeitos, recuo, combo) {
    const ficha = FICHAS.find((f) => f.id === q.f);
    const resposta = pool === "V" ? (q.a ? "✓ VERDADEIRO" : "✗ FALSO") : q.o[0];
    const titulo = acertou ? "✓ PISTA CONFIRMADA" : timeout ? "⏱ TEMPO ESGOTADO" : "✗ PISTA FALSA";
    abrirModal(`
      <div class="feedback-titulo ${acertou ? "ok" : "no"}">${titulo}</div>
      <div class="m-quem" style="--pc:${COR_JOG[pi]}">agente <b>${esc(S.players[pi].nome)}</b></div>
      <p class="pergunta" style="font-size:16px;margin:12px 0 4px">${esc(q.q)}</p>
      <div class="resp-certa"><span class="dim small">RESPOSTA CORRETA:</span><br>${esc(resposta)}</div>
      <div class="explica">💡 ${esc(q.e)}</div>
      <ul class="efeitos">${efeitos.map((e) => `<li class="${e.c}">▸ ${esc(e.t)}</li>`).join("")}</ul>
      <div class="m-acoes">
        <button class="btn btn-ghost" id="fb-ficha">📖 Ler a ficha ${ficha.id}: ${esc(ficha.titulo)}</button>
        <div class="dir"><button class="btn btn-primary btn-big" id="fb-ok">CONTINUAR &gt;</button></div>
      </div>`, acertou ? "var(--green)" : "var(--red)");
    renderPaineis();
    $("#fb-ficha").onclick = () => abrirManual(ficha.id);
    $("#fb-ok").onclick = () => {
      fecharModal();
      if (recuo > 0) mover(pi, -recuo, fimDoTurno);
      else if (combo) FX.banner({ icone: "🔥", titulo: "COMBO!", sub: "2 acertos seguidos: carta-poder liberada", cor: "var(--amber)", ms: 1200 },
        () => comprarCarta(pi, "🔥 COMBO: CARTA-PODER", fimDoTurno));
      else fimDoTurno();
    };
  }

  /* ---------------- Comprar carta ---------------- */
  function comprarCarta(pi, titulo, cb) {
    if (!S.deck.length) S.deck = montarBaralho();
    const id = S.deck.pop();
    const c = carta(id);
    const p = S.players[pi];
    let resultado = "", cls = "neutro", depois = cb;

    switch (c.tipo) {
      case "instant":
        if (c.id === "backup") {
          resultado = `${p.nome} avança 2 casas.`; cls = "mais";
          depois = () => mover(pi, 2, () => (p.pos >= FIM ? chegada(pi, cb) : cb()));
        } else if (c.id === "elogio") {
          p.pts += 15; resultado = `${p.nome} ganha +15 pontos.`; cls = "mais";
        } else if (c.id === "multa") {
          const perda = Math.min(10, p.pts); p.pts -= perda;
          resultado = `${p.nome} perde ${perda} pontos.`; cls = "menos";
        }
        break;
      default:
        if (p.mao.length >= MAO_MAX) { p.pts += 5; resultado = `Sua mão está cheia (${MAO_MAX} cartas). A carta vira +5 pontos.`; cls = "mais"; }
        else {
          p.mao.push(c.id);
          cls = "neutro";
          resultado = c.tipo === "ataque" ? "⚔ Guardada! Na sua próxima vez, ANTES de rolar o dado, clique nela no seu painel para atacar o rival."
            : c.tipo === "buff" ? "Guardada! Jogue na sua vez, antes de rolar o dado, clicando nela no seu painel."
            : "Guardada na sua mão. Ela age sozinha quando for a hora.";
        }
    }
    logar(`${p.nome} ganhou a carta ${c.nome}.`, pi);
    renderPaineis();
    abrirModal(`
      <div class="m-head"><div class="m-tipo">${esc(titulo || "▣ CARTA-PODER")}</div><div class="m-quem" style="--pc:${COR_JOG[pi]}">para <b>${esc(p.nome)}</b></div></div>
      <div class="carta-grande ${c.tipo}">
        <div class="ic">${esc(c.icone)}</div>
        <div class="nm">${esc(c.nome)}</div>
        <div class="tx">${esc(c.texto)}</div>
        <div class="lore">"${esc(c.lore)}"</div>
      </div>
      <ul class="efeitos"><li class="${cls}">▸ ${esc(resultado)}</li></ul>
      <div class="m-acoes"><div class="dir"><button class="btn btn-amber btn-big" id="c-ok">OK &gt;</button></div></div>`, "var(--amber)");
    setTimeout(() => { const cg = $("#modal-box .carta-grande"); if (cg) FX.burstEl(cg, "var(--amber)", 24, "★▣◆"); }, 300);
    $("#c-ok").onclick = () => { fecharModal(); depois(); };
  }

  /* ---------------- Chegada / turnos / fim ---------------- */
  function chegada(pi, cb) {
    const p = S.players[pi], rival = S.players[1 - pi];
    p.pos = FIM;
    p.chegou = true;
    const primeiro = S.firstArrived === null;
    const bonus = primeiro ? 30 : 15;
    if (primeiro) S.firstArrived = pi;
    p.pts += bonus;
    logar(`${p.nome} entregou o relatório à ANPD! +${bonus}`, pi);
    renderTudo(); destacar(FIM);
    FX.confete(1200);
    abrirModal(`
      <div class="feedback-titulo ok">⚑ RELATÓRIO ENTREGUE</div>
      <p class="pergunta"><b style="color:${COR_JOG[pi]}">${esc(p.nome)}</b> chegou ao fim da investigação${primeiro ? " em primeiro lugar" : ""}!</p>
      <ul class="efeitos"><li class="mais">▸ +${bonus} pontos de bônus</li>
      ${primeiro && !rival.chegou ? `<li class="neutro">▸ ${esc(rival.nome)} tem UMA ÚLTIMA JOGADA para tentar virar o placar.</li>` : ""}</ul>
      <div class="m-acoes"><div class="dir"><button class="btn btn-primary btn-big" id="ch-ok">CONTINUAR &gt;</button></div></div>`, "var(--amber)");
    $("#ch-ok").onclick = () => { fecharModal(); cb(); };
  }

  function fimDoTurno() {
    const cur = S.turn, outro = 1 - cur, A = S.players;
    renderPaineis();
    if ((A[0].chegou && A[1].chegou) || S.endAfter === cur) return fimDeJogo();
    if (A[cur].chegou && S.endAfter === null) S.endAfter = outro;
    let prox = A[outro].chegou ? cur : outro;
    let pulou = false;
    if (prox === outro && A[outro].pulaVez) {
      A[outro].pulaVez = false;
      logar(`${A[outro].nome} perdeu a vez (ataque DDoS).`, outro);
      if (S.endAfter === outro) {
        return FX.banner({ icone: "⌁", titulo: "FORA DO AR!", sub: `${esc(A[outro].nome)} perdeu a última chance (DDoS)`, cor: "var(--cyan)" }, fimDeJogo);
      }
      prox = cur; pulou = true;
    }
    S.turn = prox;
    S.cartaJogada = false;
    ui.ocupado = false;
    $("#btn-dado").disabled = false;
    destacar(-1);
    renderTudo();
    if (S.endAfter === S.turn) logar(`Última chance para ${A[S.turn].nome}!`, S.turn);
    salvar();
    if (pulou) FX.banner({ icone: "⌁", titulo: `${esc(A[outro].nome)} FORA DO AR`, sub: `Ataque DDoS: <b>${esc(A[cur].nome)}</b> joga de novo!`, cor: "var(--cyan)", cls: "ddos" });
    else FX.turno(esc(A[S.turn].nome), COR_JOG[S.turn]);
  }

  function confirmarEncerrar() {
    if (ui.ocupado || $("#modal").classList.contains("aberto")) return;
    abrirModal(`
      <div class="m-head"><div class="m-tipo">⏻ ENCERRAR A PARTIDA?</div></div>
      <p>O placar atual vira o resultado final. Use isto se o tempo da aula acabar.</p>
      <div class="m-acoes"><button class="btn btn-ghost" id="e-nao">Cancelar</button>
      <div class="dir"><button class="btn btn-red" id="e-sim">Encerrar e ver o placar</button></div></div>`, "var(--red)");
    $("#e-nao").onclick = fecharModal;
    $("#e-sim").onclick = () => { fecharModal(); fimDeJogo(); };
  }

  /* ---------------- Tela final ---------------- */
  function fimDeJogo() {
    clearInterval(ui.timer);
    S.fase = "fim";
    if (!S.fimEm) S.fimEm = Date.now();
    salvar();
    mostrarFim();
  }

  function mostrarFim() {
    tela("tela-fim");
    const [a, b] = S.players;
    let venc = null;
    if (a.pts !== b.pts) venc = a.pts > b.pts ? 0 : 1;
    else if (a.acertos !== b.acertos) venc = a.acertos > b.acertos ? 0 : 1;

    const card = (p, i) => {
      const total = p.acertos + p.erros;
      const taxa = total ? Math.round((p.acertos / total) * 100) : 0;
      const rev = Object.entries(p.errosFicha).sort((x, y) => y[1] - x[1])
        .map(([fid, n]) => { const f = FICHAS.find((x) => x.id === +fid); return `<li>Ficha ${f.id}: ${esc(f.titulo)} <span class="dim">(${n} erro${n > 1 ? "s" : ""})</span></li>`; }).join("");
      return `<div class="placar-card p${i}${venc === i ? " venceu" : ""}">
        <div class="coroa">${venc === i ? "★ VENCEDOR ★" : venc === null ? "★ EMPATE ★" : ""}</div>
        <div class="nome">${esc(p.nome)}</div>
        <div class="pts">${p.pts}<span class="pts-lbl"> pontos</span></div>
        <div class="det">${p.acertos} acertos · ${p.erros} erros · ${taxa}% de aproveitamento</div>
        <div class="revisar">${rev ? `<b>Para revisar:</b><ul>${rev}</ul>` : "<b>Nenhum erro!</b> Detetive impecável."}</div>
      </div>`;
    };

    $("#fim-wrap").innerHTML = `
      <div class="dim small">CASO #0413 // BAURUBYTE DELIVERY // ENCERRADO</div>
      <h2>${venc === null ? "EMPATE TÉCNICO!" : "CASO RESOLVIDO!"}</h2>
      <div class="placar">${card(a, 0)}${card(b, 1)}</div>
      <p class="dim small">📸 Mostre esta tela ao professor.</p>
      <div class="fim-acoes">
        <button class="btn btn-ghost" id="f-manual">📖 Revisar o Manual</button>
        <button class="btn btn-amber" id="f-revanche">⟳ Revanche (mesma dupla)</button>
        <button class="btn btn-primary" id="f-nova">⌂ Nova dupla</button>
      </div>`;
    FX.confete(2200);
    $("#f-manual").onclick = () => abrirManual(1);
    $("#f-revanche").onclick = () => { novoEstado(a.nome, b.nome); abrirJogo(true); };
    $("#f-nova").onclick = () => { limparSave(); location.reload(); };
  }

  /* ---------------- Início ---------------- */
  initInicio();
})();
