
// ==========================================
// CONECT@ SEGURA
// LEITURA EM VOZ ALTA E ACESSIBILIDADE
// ==========================================

let tamanhoFonte = 16;

let lendo = false;
let pausado = false;

let partesTexto = [];
let indiceParte = 0;

let falaAtual = null;
let sessaoLeitura = 0;

const botaoOuvir = document.getElementById("ouvirPagina");
const estadoLeitura = document.getElementById("estadoLeitura");
const conteudo = document.getElementById("conteudoPrincipal");

// ==========================================
// ATUALIZA O BOTÃO DE LEITURA
// ==========================================

function atualizarBotao(icone, descricao, pressionado) {
    botaoOuvir.textContent = icone;
    botaoOuvir.setAttribute("aria-label", descricao);
    botaoOuvir.setAttribute("aria-pressed", String(pressionado));
}

// ==========================================
// DIVIDE O TEXTO EM TRECHOS PEQUENOS
// ==========================================

function dividirTexto(texto) {

    const frases = texto.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

    const partes = [];

    frases.forEach(function(frase) {

        const palavras = frase.trim().split(/\s+/);
        let trecho = "";

        palavras.forEach(function(palavra) {

            if ((trecho + " " + palavra).trim().length > 180) {

                if (trecho) {
                    partes.push(trecho);
                }

                trecho = palavra;

            } else {

                trecho = (trecho + " " + palavra).trim();

            }

        });

        if (trecho) {
            partes.push(trecho);
        }

    });

    return partes;
}

// ==========================================
// FALA O PRÓXIMO TRECHO
// ==========================================

function falarProximaParte(sessao) {

    if (sessao !== sessaoLeitura || !lendo || pausado) {
        return;
    }

    if (indiceParte >= partesTexto.length) {
        finalizarLeitura();
        return;
    }

    falaAtual = new SpeechSynthesisUtterance(
        partesTexto[indiceParte]
    );

    falaAtual.lang = "pt-BR";
    falaAtual.rate = 0.95;
    falaAtual.pitch = 1;

    falaAtual.onend = function() {

        if (sessao !== sessaoLeitura || pausado || !lendo) {
            return;
        }

        indiceParte++;

        // Pequeno intervalo entre os trechos
        setTimeout(function() {
            falarProximaParte(sessao);
        }, 100);

    };

    falaAtual.onerror = function(event) {

        if (sessao !== sessaoLeitura || pausado || !lendo) {
            return;
        }

        if (
            event.error === "canceled" ||
            event.error === "interrupted"
        ) {
            return;
        }

        estadoLeitura.textContent =
            "O navegador não conseguiu continuar a leitura.";

        finalizarLeitura();
    };

    speechSynthesis.speak(falaAtual);
}

// ==========================================
// COMEÇA UMA NOVA LEITURA
// ==========================================

function iniciarLeitura() {

    if (
        !("speechSynthesis" in window) ||
        typeof SpeechSynthesisUtterance === "undefined"
    ) {
        estadoLeitura.textContent =
            "Seu navegador não oferece suporte à leitura em voz alta.";

        return;
    }

    partesTexto = dividirTexto(conteudo.innerText);

    if (partesTexto.length === 0) {
        estadoLeitura.textContent = "Não há conteúdo para ler.";
        return;
    }

    indiceParte = 0;
    lendo = true;
    pausado = false;

    sessaoLeitura++;

    const sessao = sessaoLeitura;

    speechSynthesis.cancel();

    atualizarBotao("⏸️", "Pausar leitura", true);

    estadoLeitura.textContent = "Preparando a leitura...";

    // Pequena espera para o Chrome cancelar a fala anterior
    setTimeout(function() {

        if (sessao === sessaoLeitura && lendo && !pausado) {
            estadoLeitura.textContent = "Leitura em andamento.";
            falarProximaParte(sessao);
        }

    }, 200);
}

// ==========================================
// PAUSA A LEITURA
// ==========================================

function pausarLeitura() {

    pausado = true;

    // Invalida eventos da fala anterior
    sessaoLeitura++;

    // Interrompe o trecho atual
    speechSynthesis.cancel();

    atualizarBotao("▶️", "Continuar leitura", false);

    estadoLeitura.textContent =
        "Leitura pausada. Ao continuar, o trecho atual será repetido.";
}

// ==========================================
// CONTINUA A LEITURA
// ==========================================

function continuarLeitura() {

    pausado = false;

    // Cria uma nova sessão de leitura
    sessaoLeitura++;

    const sessao = sessaoLeitura;

    // Limpa qualquer fala que tenha ficado na fila
    speechSynthesis.cancel();

    atualizarBotao("⏸️", "Pausar leitura", true);

    estadoLeitura.textContent = "Continuando a leitura...";

    // Aguarda o Chrome liberar a reprodução
    setTimeout(function() {

        if (sessao === sessaoLeitura && lendo && !pausado) {
            estadoLeitura.textContent = "Leitura em andamento.";
            falarProximaParte(sessao);
        }

    }, 200);
}

// ==========================================
// FINALIZA A LEITURA
// ==========================================

function finalizarLeitura() {

    sessaoLeitura++;

    lendo = false;
    pausado = false;

    partesTexto = [];
    indiceParte = 0;
    falaAtual = null;

    atualizarBotao("🔊", "Ouvir página", false);

    estadoLeitura.textContent = "Leitura finalizada.";
}

// ==========================================
// CONTROLA O BOTÃO DE SOM
// ==========================================

botaoOuvir.addEventListener("click", function() {

    if (!lendo) {

        iniciarLeitura();

    } else if (!pausado) {

        pausarLeitura();

    } else {

        continuarLeitura();

    }

});

// ==========================================
// AUMENTA O TAMANHO DO TEXTO
// ==========================================

document.getElementById("aumentarFonte").addEventListener("click", function() {

    if (tamanhoFonte < 24) {

        tamanhoFonte += 2;

        conteudo.style.fontSize = tamanhoFonte + "px";

    }

});

// ==========================================
// DIMINUI O TAMANHO DO TEXTO
// ==========================================

document.getElementById("diminuirFonte").addEventListener("click", function() {

    if (tamanhoFonte > 14) {

        tamanhoFonte -= 2;

        conteudo.style.fontSize = tamanhoFonte + "px";

    }

});

// ==========================================
// QUIZ DE SEGURANÇA DIGITAL
// ==========================================

const respostaErrada = document.getElementById("respostaErrada");
const respostaCerta = document.getElementById("respostaCerta");
const resultado = document.getElementById("resultado");

respostaErrada.addEventListener("click", function() {

    resultado.textContent =
        "Ops! Essa pode ser uma tentativa de golpe. Nunca clique sem verificar a mensagem.";

});

respostaCerta.addEventListener("click", function() {

    resultado.textContent =
        "Muito bem! 💗 Sempre desconfie de mensagens suspeitas e verifique antes de clicar.";

});
                   
