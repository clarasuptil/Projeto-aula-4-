
// ======================================
// CONECT@ SEGURA - ACESSIBILIDADE
// ======================================

let tamanhoFonte = 16;
let lendo = false;
let pausado = false;
let textoCompleto = "";
let indiceAtual = 0;
let falaAtual = null;

const botaoOuvir = document.getElementById("ouvirPagina");
const estadoLeitura = document.getElementById("estadoLeitura");

// Atualiza o botão
function atualizarBotao(texto, descricao, estado) {
    botaoOuvir.textContent = texto;
    botaoOuvir.setAttribute("aria-label", descricao);
    botaoOuvir.setAttribute("aria-pressed", estado);
}

// Finaliza a leitura
function finalizarLeitura() {
    lendo = false;
    pausado = false;
    indiceAtual = 0;
    falaAtual = null;

    atualizarBotao("🔊", "Ouvir página", "false");

    estadoLeitura.textContent = "Leitura finalizada.";
}

// Inicia a fala a partir de um trecho
function iniciarFala() {

    if (indiceAtual >= textoCompleto.length) {
        finalizarLeitura();
        return;
    }

    falaAtual = new SpeechSynthesisUtterance(
        textoCompleto.substring(indiceAtual)
    );

    falaAtual.lang = "pt-BR";

    falaAtual.onboundary = function(event) {
        if (event.name === "word") {
            indiceAtual += event.charLength || 0;
        }
    };

    falaAtual.onend = function() {
        if (!pausado) {
            finalizarLeitura();
        }
    };

    falaAtual.onerror = function(event) {
        if (event.error !== "canceled" && event.error !== "interrupted") {
            estadoLeitura.textContent = "Não foi possível continuar a leitura.";
            finalizarLeitura();
        }
    };

    speechSynthesis.speak(falaAtual);
}

// Botão de leitura
function lerEmVozAlta() {

    if (!("speechSynthesis" in window)) {
        estadoLeitura.textContent =
            "Seu navegador não oferece suporte à leitura em voz alta.";
        return;
    }

    // Se estiver lendo, pausa
    if (lendo && !pausado) {

        if (falaAtual && "charIndex" in falaAtual) {
            // Guarda uma posição aproximada da leitura
            indiceAtual = Math.max(indiceAtual, falaAtual.charIndex);
        }

        pausado = true;
        speechSynthesis.cancel();

        atualizarBotao("▶️", "Continuar leitura", "false");
        estadoLeitura.textContent = "Leitura pausada.";

        return;
    }

    // Se estiver pausada, continua
    if (lendo && pausado) {

        pausado = false;

        speechSynthesis.cancel();

        atualizarBotao("⏸️", "Pausar leitura", "true");
        estadoLeitura.textContent = "Leitura em andamento.";

        iniciarFala();

        return;
    }

    // Começa uma nova leitura
    textoCompleto = document.querySelector("main").innerText;
    indiceAtual = 0;
    lendo = true;
    pausado = false;

    speechSynthesis.cancel();

    atualizarBotao("⏸️", "Pausar leitura", "true");
    estadoLeitura.textContent = "Leitura em andamento.";

    iniciarFala();
}

// Conecta o botão de som
botaoOuvir.addEventListener("click", lerEmVozAlta);


// ======================================
// AUMENTAR E DIMINUIR A FONTE
// ======================================

document.getElementById("aumentarFonte").addEventListener("click", function() {

    if (tamanhoFonte < 22) {
        tamanhoFonte += 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});

document.getElementById("diminuirFonte").addEventListener("click", function() {

    if (tamanhoFonte > 14) {
        tamanhoFonte -= 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});


// ======================================
// QUIZ DE SEGURANÇA DIGITAL
// ======================================

function responder(correta) {

    const resultado = document.getElementById("resultado");

    if (correta) {
        resultado.textContent =
            "Muito bem! 💗 Sempre desconfie de mensagens suspeitas e verifique antes de clicar.";
    } else {
        resultado.textContent =
            "Ops! Essa pode ser uma tentativa de golpe. Nunca clique sem verificar a mensagem!";
    }

            }
