const inputEle = document.getElementById('placeholder-text');
let nome, para = "Todos", tipo = "message", div, elementoQueQueroQueApareca = '', listaAntiga = [], listaMensagens = [{from: '', text: '', time: '', to: '', type: ''}], ultimaMensagem = '', novaMensagem = '';
function entrar(){
    div = document.querySelector(".telaEntrada");
    if(div.children[1].value !== ''){
        nome = {name : `${div.children[1].value}`};
        div.children[1].value = '';
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nome);
        div.children[1].classList.add('desabilitada');
        div.children[2].classList.add('desabilitada');
        div.children[3].classList.add('desabilitada');
        div.children[4].classList.remove('desabilitada');
        div.children[5].classList.remove('desabilitada');
        promessa.then(sucesso);
        promessa.catch(falha);
    }
}
function sucesso() {
    div.children[4].classList.add('desabilitada');
    div.children[5].classList.add('desabilitada');
    div.classList.add("desabilitada");
    div.classList.remove("telaEntrada");
    setInterval(mantemConexao, 5000);
	atualizaMensagens();
    setInterval(atualizaMensagens, 3000);
    setInterval(atualizaParticipantes, 10000);
}
function falha() {
    div.children[1].classList.remove('desabilitada');
    div.children[2].classList.remove('desabilitada');
    div.children[3].classList.remove('desabilitada');
    div.children[4].classList.add('desabilitada');
    div.children[5].classList.add('desabilitada');
}
function mantemConexao(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome);
}
function atualizaMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(processarMensagens);
}
function processarMensagens(resposta){    
    listaAntiga = listaMensagens;
    listaMensagens = resposta.data;
    ultimaMensagem = listaAntiga[listaAntiga.length-1];
    novaMensagem = listaMensagens[listaMensagens.length-1];
    if(ultimaMensagem.from !== novaMensagem.from || ultimaMensagem.text !== novaMensagem.text || ultimaMensagem.time !== novaMensagem.time || ultimaMensagem.to !== novaMensagem.to || ultimaMensagem.type !== novaMensagem.type){
        const mensagem = document.querySelector(".container");
        mensagem.innerHTML = "";
        for(let i = 0; i < listaMensagens.length; i++){
            if(listaMensagens[i].type === "status"){
                mensagem.innerHTML += `
                    <div class="mensagem status" id="${i}" data-test="message">
                        <span class="horario">(${listaMensagens[i].time})</span>
                        <span class="nome">${listaMensagens[i].from}</span>
                        <span class="texto">${listaMensagens[i].text}</span>
                    </div>
                `;
            } else if(listaMensagens[i].type === "message"){
                mensagem.innerHTML += `
                    <div class="mensagem" id="${i}" data-test="message">
                        <span class="horario">(${listaMensagens[i].time})</span>
                        <span class="nome">${listaMensagens[i].from}</span>
                        <span class="texto">para</span>
                        <span class="nome">${listaMensagens[i].to} </span>
                        <span class="texto">${listaMensagens[i].text}</span>
                    </div>
                `;
            }else if((listaMensagens[i].type === "private_message" && listaMensagens[i].to === nome.name) || (listaMensagens[i].type === "private_message" && listaMensagens[i].from === nome.name)){
                mensagem.innerHTML += `
                    <div class="mensagem reservadas" id="${i}" data-test="message">
                        <span class="horario">(${listaMensagens[i].time})</span>
                        <span class="nome">${listaMensagens[i].from}</span>
                        <span class="texto">reservadamente para</span>
                        <span class="nome">${listaMensagens[i].to} </span>
                        <span class="texto">${listaMensagens[i].text}</span>
                    </div>
                `;
            }
        }
        elementoQueQueroQueApareca = document.getElementById(listaMensagens.length-1);
        if(elementoQueQueroQueApareca !== null){
            elementoQueQueroQueApareca.scrollIntoView();
        }     
    }
}
function enviarMensagem(botaoEnviar){
    const rodape = botaoEnviar.parentNode;
    let texto = rodape.children[0].children[0].value;
    if(texto !== ''){
        let mensagem = {
            from: nome.name,
            to: para,
            text: texto,
            type: tipo
        }
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
        rodape.children[0].children[0].value = '';
        promessa.then(atualizaMensagens);
        promessa.catch(atualizaPagina);
    }
}
function atualizaPagina(){
    window.location.reload();
}
inputEle.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        let btn = document.querySelector(".bEnviar");
        btn.click();
    }
});
function encolher(item){
    item.classList.add("desabilitada");
    const lista = document.querySelector(".listaParticipantes");
    lista.classList.add("desabilitada");
    const container = document.querySelector("body");
    container.classList.remove("naoRola");
    const listaP = document.querySelector(".lista");
    listaP.innerHTML = "";
}
function participantes(){
    const fundo = document.querySelector(".fundo");
    const lista = document.querySelector(".listaParticipantes");
    const container = document.querySelector("body");
    container.classList.add("naoRola");
    lista.classList.remove("desabilitada");
    fundo.classList.remove("desabilitada");
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(processaParticipantes);
}
function atualizaParticipantes(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(processaParticipantes);
}
function processaParticipantes(resposta){
    let listaParticipantes = resposta.data;
    const lista = document.querySelector(".lista");
    for(let i = 0; i < listaParticipantes.length; i++){
        lista.innerHTML += `
        <div class="caixaParticipante" onclick="selecionar(this)" data-test="participant"><div class="caixaNome"><ion-icon class="iParticipante" name="person-circle"></ion-icon><span class="participante">${listaParticipantes[i].name}</span></div><img class="selecionado desabilitada" src="./imagem/Vector.png" alt="" data-test="check"></div>
        `;
    }
}
function selecionar(item){
    const caixas = document.querySelectorAll(".caixaParticipante");
    for(let i = 0; i < caixas.length; i++){
        caixas[i].children[1].classList.add("desabilitada");
        item.children[1].classList.remove("desabilitada"); 
    }
    para = item.children[0].children[1].innerHTML; 
    const descricao = document.querySelector(".descricao");
    if(para === "Todos"){
        descricao.classList.add("desabilitada");
    }else{
        descricao.classList.remove("desabilitada");
        descricao.children[0].innerHTML = `Enviando para ${para}`;
    }
}
function selecionarV(item){
    const caixas = document.querySelectorAll(".caixaParticipanteV");
    for(let i = 0; i < caixas.length; i++){
        caixas[i].children[1].classList.add("desabilitada");
        item.children[1].classList.remove("desabilitada"); 
    } 
    const descricao = document.querySelector(".descricao");
    if(item.children[0].children[1].innerHTML === "Público"){
        tipo = "message";
        descricao.children[1].classList.add("desabilitada");
    }else{
        tipo = "private_message";
        descricao.children[1].classList.remove("desabilitada");
    }
}