/* =========================================================
   OPERAÇÃO LGPD — efeitos visuais
   ========================================================= */
const FX = (function () {
  "use strict";
  const layer = () => document.getElementById("fx-layer");
  const rnd = (n) => Math.floor(Math.random() * n);

  function el(cls, html) {
    const d = document.createElement("div");
    d.className = cls;
    if (html != null) d.innerHTML = html;
    layer().appendChild(d);
    return d;
  }

  /* clarão de tela inteira */
  function flash(cor, ms) {
    ms = ms || 450;
    const d = el("fx-flash");
    d.style.background = cor;
    d.style.animationDuration = ms + "ms";
    setTimeout(() => d.remove(), ms + 50);
  }

  /* tremida da tela */
  function shake() {
    const m = document.querySelector("main");
    const box = document.getElementById("modal-box");
    [m, box].forEach((x) => { if (!x) return; x.classList.remove("fx-shake"); void x.offsetWidth; x.classList.add("fx-shake"); });
    setTimeout(() => [m, box].forEach((x) => x && x.classList.remove("fx-shake")), 550);
  }

  /* explosão de partículas (caracteres) */
  function burst(x, y, cor, n, chars) {
    n = n || 28; chars = chars || "01";
    const lista = Array.from(chars);
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "fx-part";
      s.textContent = lista[rnd(lista.length)];
      const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 170;
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      s.style.color = cor;
      s.style.fontSize = 14 + rnd(16) + "px";
      s.style.animationDelay = rnd(90) + "ms";
      layer().appendChild(s);
      setTimeout(() => s.remove(), 1400);
    }
  }
  function burstEl(elm, cor, n, chars) {
    if (!elm) return;
    const r = elm.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, cor, n, chars);
  }

  /* texto flutuante (+20, −10...) */
  function float(elm, txt, cor) {
    if (!elm) return;
    const r = elm.getBoundingClientRect();
    const d = el("fx-float");
    d.textContent = txt;
    d.style.left = r.left + r.width / 2 + "px";
    d.style.top = r.top + "px";
    d.style.color = cor;
    setTimeout(() => d.remove(), 1600);
  }

  /* faixa de tela cheia (clique para pular) */
  function banner(o, cb) {
    const d = el(`fx-banner ${o.cls || ""}`,
      `<div class="fb-in"><div class="fb-ic">${o.icone}</div><div class="fb-t">${o.titulo}</div>${o.sub ? `<div class="fb-s">${o.sub}</div>` : ""}</div>`);
    d.style.setProperty("--fc", o.cor || "var(--green)");
    let feito = false;
    const fim = () => {
      if (feito) return; feito = true;
      d.classList.add("saindo");
      setTimeout(() => { d.remove(); if (cb) cb(); }, 260);
    };
    d.onclick = fim;
    setTimeout(fim, o.ms || 1500);
    return d;
  }

  /* aviso de troca de vez (não bloqueia) */
  function turno(nome, cor) {
    const d = el("fx-turno", `▶ VEZ DE <b>${nome}</b>`);
    d.style.setProperty("--fc", cor);
    setTimeout(() => d.remove(), 1800);
  }

  /* alarme de vazamento */
  function alerta(cb) {
    flash("var(--red)", 650);
    shake();
    banner({ icone: "⚠", titulo: "ALERTA DE VAZAMENTO", sub: "Contenha o incidente: responda certo!", cor: "var(--red)", ms: 1700, cls: "alarme" }, cb);
  }

  /* pacotes voando (DDoS) */
  function pacotes(cor) {
    for (let i = 0; i < 46; i++) {
      const s = document.createElement("span");
      s.className = "fx-packet";
      s.textContent = ["■", "▪", "GET /", "SYN", "▮"][rnd(5)];
      s.style.top = rnd(100) + "vh";
      s.style.color = cor;
      s.style.animationDelay = rnd(900) + "ms";
      s.style.animationDuration = 500 + rnd(500) + "ms";
      layer().appendChild(s);
      setTimeout(() => s.remove(), 2200);
    }
  }

  const ATQ = {
    ransom:     { cor: "var(--red)",     sub: "🔒 SEUS DADOS FORAM CRIPTOGRAFADOS", chars: "🔒01$" },
    phishing:   { cor: "var(--amber)",   sub: "✉ \"Parabéns! Clique aqui para resgatar seu PIX\"", chars: "✉@$" },
    ddos:       { cor: "var(--cyan)",    sub: "503 SERVICE UNAVAILABLE", chars: "■▪01" },
    auditoria:  { cor: "var(--violet)",  sub: "FISCALIZAÇÃO EM ANDAMENTO", chars: "⏱⚖§" },
    engenharia: { cor: "var(--magenta)", sub: "\"Oi, aqui é do suporte... me passa sua senha?\"", chars: "☻?!" }
  };

  /* animação de ataque com carta-poder */
  function ataque(carta, alvo, resultado, bloqueado, cb) {
    const a = ATQ[carta.id] || { cor: "var(--red)", sub: "", chars: "01" };
    flash(a.cor, 600);
    shake();
    if (carta.id === "ddos") pacotes(a.cor);
    burst(window.innerWidth / 2, window.innerHeight / 2, a.cor, 40, a.chars);
    const d = banner({
      icone: carta.icone, titulo: carta.nome, cor: a.cor, cls: "ataque", ms: bloqueado ? 2500 : 2300,
      sub: `${a.sub}<div class="fb-alvo">ALVO: ${alvo}</div>${resultado ? `<div class="fb-res">${resultado}</div>` : ""}`
    }, cb);
    if (bloqueado) {
      setTimeout(() => {
        const e = document.createElement("div");
        e.className = "fb-escudo";
        e.innerHTML = `<div><div class="fb-esc-ic">⛨</div>BLOQUEADO!<div class="fb-s">${alvo} usou o ESCUDO DE CRIPTOGRAFIA</div></div>`;
        d.querySelector(".fb-in").appendChild(e);
        flash("var(--cyan)", 500);
        burst(window.innerWidth / 2, window.innerHeight / 2, "var(--cyan)", 34, "⛨◆01");
      }, 1000);
    }
  }

  /* confete binário */
  function confete(ms) {
    const cores = ["var(--green)", "var(--magenta)", "var(--cyan)", "var(--amber)"];
    const ini = Date.now();
    const it = setInterval(() => {
      if (Date.now() - ini > (ms || 1500)) return clearInterval(it);
      burst(rnd(window.innerWidth), rnd(window.innerHeight * 0.7), cores[rnd(cores.length)], 14, "01★◆");
    }, 160);
  }

  /* chuva de caracteres no fundo */
  function chuva(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const fs = 16, chars = "01LGPDANPD{}<>/$#*".split("");
    let cols = [], w = 0, h = 0;
    const ajustar = () => {
      w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight;
      cols = Array.from({ length: Math.ceil(w / fs) }, () => rnd(h / fs));
    };
    ajustar();
    window.addEventListener("resize", ajustar);
    let ult = 0;
    const loop = (t) => {
      requestAnimationFrame(loop);
      if (t - ult < 70) return;
      ult = t;
      ctx.fillStyle = "rgba(4,7,11,.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#39ff88";
      ctx.font = fs + "px monospace";
      cols.forEach((y, i) => {
        ctx.fillText(chars[rnd(chars.length)], i * fs, y * fs);
        cols[i] = y * fs > h && Math.random() > 0.97 ? 0 : y + 1;
      });
    };
    requestAnimationFrame(loop);
  }

  return { flash, shake, burst, burstEl, float, banner, turno, alerta, ataque, confete, chuva };
})();
