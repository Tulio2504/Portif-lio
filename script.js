// ===== 1. MODO CLARO / ESCURO =====
const btnTema = document.querySelector("#btnTema");

// Ao abrir a página, vê se o usuário já escolheu um tema antes (salvo no localStorage)
if (localStorage.getItem("tema") === "claro") {
  document.body.classList.add("claro");
  btnTema.textContent = "☀️";
}

btnTema.addEventListener("click", function () {
  document.body.classList.toggle("claro"); // liga/desliga a classe "claro"

  if (document.body.classList.contains("claro")) {
    localStorage.setItem("tema", "claro");   // salva a escolha
    btnTema.textContent = "☀️";
  } else {
    localStorage.setItem("tema", "escuro");
    btnTema.textContent = "🌙";
  }
});

// ===== 2. NAVEGAÇÃO ENTRE AS TELAS =====
// Só uma tela fica visível por vez (a que tem a classe "ativa")
const telas = document.querySelectorAll(".tela");

function mostrarTela(id) {
  let alvo = document.getElementById(id);
  if (!alvo || !alvo.classList.contains("tela")) {
    alvo = document.getElementById("inicio"); // id inválido: volta ao início
  }

  telas.forEach(function (t) {
    t.classList.remove("ativa", "visivel");
  });
  alvo.classList.add("ativa");
  window.scrollTo(0, 0);

  // pequena animação de entrada (interação 2) e enche as barras de habilidades
  setTimeout(function () {
    alvo.classList.add("visivel");
    alvo.querySelectorAll(".preenche").forEach(function (barra) {
      barra.style.width = barra.dataset.nivel + "%";
    });
  }, 30);

  // se saiu da tela de habilidades, zera as barras para animar de novo
  if (alvo.id !== "habilidades") {
    document.querySelectorAll(".preenche").forEach(function (barra) {
      barra.style.width = "0";
    });
  }
}

// Todo link que começa com # (menu, quadrados, VOLTAR...) troca de tela
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    const id = link.getAttribute("href").slice(1);
    if (id === "") return; // links com # vazio (ex.: projetos sem link ainda)
    e.preventDefault();
    history.pushState(null, "", "#" + id);
    mostrarTela(id);
  });
});

// Botão PLAY leva para o menu de jogos
document.querySelector("#btnPlay").addEventListener("click", function () {
  history.pushState(null, "", "#menu");
  mostrarTela("menu");
});

// Botão voltar do navegador
window.addEventListener("popstate", function () {
  mostrarTela(location.hash.slice(1) || "inicio");
});

// Ao abrir a página, mostra a tela do endereço (ou o início)
mostrarTela(location.hash.slice(1) || "inicio");

// ===== 3. TEXTO DIGITANDO (interação 1) =====
const frase = "Desenvolvedor em formação, interessado em programação, tecnologia e criação de projetos.";
const campoDigitando = document.querySelector("#digitando");
let posicao = 0;

function digitar() {
  if (posicao < frase.length) {
    campoDigitando.textContent += frase.charAt(posicao); // adiciona uma letra
    posicao++;
    setTimeout(digitar, 40); // espera 40ms e chama de novo
  }
}
digitar();

// ===== 4. MODAL DOS PROJETOS =====
const modal = document.querySelector("#modal");

document.querySelectorAll(".btn-detalhes").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const card = botao.closest(".card"); // pega o card do botão clicado
    document.querySelector("#modalTitulo").textContent = card.dataset.nome;
    document.querySelector("#modalDesc").textContent = card.dataset.desc;
    modal.classList.add("aberto"); // mostra o modal
  });
});

function fecharModal() {
  modal.classList.remove("aberto");
}
document.querySelector("#fecharModal").addEventListener("click", fecharModal);
// Fecha também ao clicar fora da caixa
modal.addEventListener("click", function (e) {
  if (e.target === modal) fecharModal();
});

// ===== 5. MÁSCARA DO TELEFONE =====
// 31999999999 vira (31) 99999-9999
const campoTelefone = document.querySelector("#telefone");

campoTelefone.addEventListener("input", function () {
  let numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11); // só números, máx. 11

  if (numeros.length > 7) {
    numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
  } else if (numeros.length > 2) {
    numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
  } else if (numeros.length > 0) {
    numeros = "(" + numeros;
  }
  campoTelefone.value = numeros;
});

// ===== 6. VALIDAÇÃO DO FORMULÁRIO =====
const formulario = document.querySelector("#formulario");

// Mostra ou limpa a mensagem de erro de um campo
function mostrarErro(campo, idErro, texto) {
  document.querySelector(idErro).textContent = texto;
  if (texto) {
    campo.classList.add("invalido");
  } else {
    campo.classList.remove("invalido");
  }
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault(); // impede a página de recarregar

  const nome = document.querySelector("#nome");
  const email = document.querySelector("#email");
  const mensagem = document.querySelector("#mensagem");
  let tudoCerto = true;

  // Nome não pode ficar vazio
  if (nome.value.trim() === "") {
    mostrarErro(nome, "#erroNome", "Digite seu nome.");
    tudoCerto = false;
  } else {
    mostrarErro(nome, "#erroNome", "");
  }

  // Telefone precisa ter 11 números: (31) 99999-9999 tem 15 caracteres
  if (campoTelefone.value.length < 15) {
    mostrarErro(campoTelefone, "#erroTelefone", "Digite o telefone completo com DDD.");
    tudoCerto = false;
  } else {
    mostrarErro(campoTelefone, "#erroTelefone", "");
  }

  // E-mail precisa ter @ e .
  if (!email.value.includes("@") || !email.value.includes(".")) {
    mostrarErro(email, "#erroEmail", "Digite um e-mail válido (com @ e .).");
    tudoCerto = false;
  } else {
    mostrarErro(email, "#erroEmail", "");
  }

  // Mensagem não pode ficar vazia
  if (mensagem.value.trim() === "") {
    mostrarErro(mensagem, "#erroMensagem", "Escreva uma mensagem.");
    tudoCerto = false;
  } else {
    mostrarErro(mensagem, "#erroMensagem", "");
  }

  // Se tudo estiver certo, mostra sucesso e limpa o formulário
  if (tudoCerto) {
    document.querySelector("#sucesso").textContent = "Mensagem enviada com sucesso!";
    formulario.reset();
  } else {
    document.querySelector("#sucesso").textContent = "";
  }
});
