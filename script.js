// =====================================
// CONECT@ SEGURA
// LEITURA EM VOZ ALTA PARA CELULAR
// =====================================

let tamanhoFonte = 16;
let lendo = false;
let pausado = false;
let partes = [];
let indiceParte = 0;
let falaAtual = null;

const botaoOuvir = document.getElementById("ouvirPagina");
const estadoLeitura = document.getElementById("estadoLeitura");

// Atualiza o botão
function atualizarBotao(icone, descricao) {
    botaoOuvir.textContent = icone;
    botaoOuvir.setAttribute("aria-label", descricao);
}

// Divide o texto em frases menores
function dividirTexto(texto) {
    return texto.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
}

// Lê a próxima frase
function lerProximaParte() {

    if (pausado || !lendo) {
        return;
    }

    if (indiceParte >= partes.length) {
        finalizarLeitura();
        return;
    }

    falaAtual = new SpeechSynthesisUtterance(
        partes[indiceParte]
    );

    falaAtual.lang = "pt-BR";
    falaAtual.rate = 1;

    falaAtual.onend = function() {
        indiceParte++;
        lerProximaParte();
    };

    falaAtual.onerror = function() {
        if (lendo && !pausado) {
            estadoLeitura.textContent =
                "O navegador teve um problema ao ler o texto.";
            finalizarLeitura();
        }
    };

    speechSynthesis.speak(falaAtual);
}

// Inicia a leitura
function iniciarLeitura() {

    const conteudo = document.querySelector("main");

    partes = dividirTexto(conteudo.innerText);
    indiceParte = 0;
    lendo = true;
    pausado = false;

    speechSynthesis.cancel();

    atualizarBotao("⏸️", "Pausar leitura");
    estadoLeitura.textContent = "Leitura em andamento.";

    lerProximaParte();
}

// Pausa a leitura
function pausarLeitura() {

    pausado = true;

    speechSynthesis.cancel();

    atualizarBotao("▶️", "Continuar leitura");
    estadoLeitura.textContent = "Leitura pausada.";
}

// Continua a leitura
function continuarLeitura() {

    pausado = false;

    atualizarBotao("⏸️", "Pausar leitura");
    estadoLeitura.textContent = "Leitura em andamento.";

    lerProximaParte();
}

// Finaliza a leitura
function finalizarLeitura() {

    lendo = false;
    pausado = false;
    partes = [];
    indiceParte = 0;
    falaAtual = null;

    speechSynthesis.cancel();

    atualizarBotao("🔊", "Ouvir página");
    estadoLeitura.textContent = "Leitura finalizada.";
}

// Controla o botão de som
botaoOuvir.addEventListener("click", function() {

    if (!lendo) {
        iniciarLeitura();
    } else if (!pausado) {
        pausarLeitura();
    } else {
        continuarLeitura();
    }

});


// =====================================
// AUMENTAR E DIMINUIR A FONTE
// =====================================

document.getElementById("aumentarFonte").addEventListener("click", function() {

    if (tamanhoFonte < 22) {
        tamanhoFonte += 2;
        document.querySelector("main").style.fontSize =
            tamanhoFonte + "px";
    }

});

document.getElementById("diminuirFonte").addEventListener("click", function() {

    if (tamanhoFonte > 14) {
        tamanhoFonte -= 2;
        document.querySelector("main").style.fontSize =
            tamanhoFonte + "px";
    }

});


// =====================================
// QUIZ
// =====================================

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

