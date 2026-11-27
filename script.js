
let lendo = false;
let pausado = false;
let tamanhoFonte = 16;
let falaAtual = null;

const botaoOuvir = document.getElementById("ouvirPagina");
const estadoLeitura = document.getElementById("estadoLeitura");

// Finaliza a leitura
function finalizarLeitura() {
    lendo = false;
    pausado = false;
    falaAtual = null;

    botaoOuvir.textContent = "🔊";
    botaoOuvir.setAttribute("aria-label", "Ouvir página");
    botaoOuvir.setAttribute("aria-pressed", "false");

    estadoLeitura.textContent = "Leitura finalizada.";
}

// Inicia, pausa ou continua a leitura
function lerEmVozAlta() {

    if (!("speechSynthesis" in window)) {
        estadoLeitura.textContent =
            "Seu navegador não oferece suporte à leitura em voz alta.";
        return;
    }

    // Se já existe uma leitura
    if (lendo) {

        if (pausado) {
            speechSynthesis.resume();

            pausado = false;

            botaoOuvir.textContent = "⏸️";
            botaoOuvir.setAttribute("aria-label", "Pausar leitura");

            estadoLeitura.textContent = "Leitura em andamento.";

        } else {
            speechSynthesis.pause();

            pausado = true;

            botaoOuvir.textContent = "▶️";
            botaoOuvir.setAttribute("aria-label", "Continuar leitura");

            estadoLeitura.textContent = "Leitura pausada.";
        }

        return;
    }

    // Seleciona o conteúdo principal
    const conteudo = document.querySelector("main");
    const texto = conteudo.innerText;

    falaAtual = new SpeechSynthesisUtterance(texto);

    falaAtual.lang = "pt-BR";

    falaAtual.onend = finalizarLeitura;
    falaAtual.onerror = finalizarLeitura;

    // Cancela leituras anteriores
    speechSynthesis.cancel();

    // Inicia a leitura
    lendo = true;
    pausado = false;

    speechSynthesis.speak(falaAtual);

    botaoOuvir.textContent = "⏸️";
    botaoOuvir.setAttribute("aria-label", "Pausar leitura");

    estadoLeitura.textContent = "Leitura em andamento.";
}

// Botão de leitura
botaoOuvir.addEventListener("click", lerEmVozAlta);

// Aumenta o texto
document.getElementById("aumentarFonte").addEventListener("click", function() {

    if (tamanhoFonte < 22) {
        tamanhoFonte += 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});

// Diminui o texto
document.getElementById("diminuirFonte").addEventListener("click", function() {

    if (tamanhoFonte > 14) {
        tamanhoFonte -= 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});

// Quiz
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
