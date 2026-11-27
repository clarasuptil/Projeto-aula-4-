
let lendo = false;
let tamanhoFonte = 16;

const botaoOuvir = document.getElementById("ouvirPagina");
const estadoLeitura = document.getElementById("estadoLeitura");

// Finaliza a leitura
function finalizarLeitura() {
    lendo = false;

    botaoOuvir.textContent = "🔊";
    botaoOuvir.setAttribute("aria-label", "Ouvir página");
    botaoOuvir.setAttribute("aria-pressed", "false");

    estadoLeitura.textContent = "Leitura finalizada.";
}

// Lê o conteúdo da página em voz alta
function lerEmVozAlta() {

    if (!("speechSynthesis" in window)) {
        estadoLeitura.textContent =
            "Seu navegador não oferece suporte à leitura em voz alta.";
        return;
    }

    // Se já estiver lendo, pausa ou continua
    if (lendo === true) {

        if (speechSynthesis.paused === true) {
            speechSynthesis.resume();

            botaoOuvir.textContent = "⏸️";
            estadoLeitura.textContent = "Leitura em andamento.";

        } else {
            speechSynthesis.pause();

            botaoOuvir.textContent = "▶️";
            estadoLeitura.textContent = "Leitura pausada.";
        }

        return;
    }

    // Seleciona o conteúdo principal
    let conteudo = document.querySelector("main");
    let texto = conteudo.innerText;

    // Cria a fala
    let fala = new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";

    fala.onend = finalizarLeitura;
    fala.onerror = finalizarLeitura;

    // Cancela qualquer leitura anterior
    speechSynthesis.cancel();

    // Inicia uma nova leitura
    speechSynthesis.speak(fala);

    lendo = true;

    botaoOuvir.textContent = "⏸️";
    botaoOuvir.setAttribute("aria-label", "Pausar leitura");
    botaoOuvir.setAttribute("aria-pressed", "true");

    estadoLeitura.textContent = "Leitura em andamento.";
}

// Botão de leitura
botaoOuvir.addEventListener("click", lerEmVozAlta);

// Aumenta o tamanho do texto
document.getElementById("aumentarFonte").addEventListener("click", function() {

    if (tamanhoFonte < 22) {
        tamanhoFonte += 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});

// Diminui o tamanho do texto
document.getElementById("diminuirFonte").addEventListener("click", function() {

    if (tamanhoFonte > 14) {
        tamanhoFonte -= 2;
        document.querySelector("main").style.fontSize = tamanhoFonte + "px";
    }

});

// Quiz de segurança digital
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
