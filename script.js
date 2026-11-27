
function responder(correta) {

    const resultado = document.getElementById("resultado");

    if (correta) {
        resultado.textContent = "Muito bem! 💗 Sempre desconfie de mensagens suspeitas e verifique antes de clicar.";
    } else {
        resultado.textContent = "Ops! Essa pode ser uma tentativa de golpe. Nunca clique sem verificar a mensagem!";
    }

}
