// Função para gerar um ID aleatório
function gerarIdAleatorio() {
    return Math.random().toString(36).substr(2, 9); // Gera um ID curto e único
}

// Função para gerar o QR Code
function gerarQRCode() {
    const nome = document.getElementById('nome').value;

    if (nome) {
        const id = gerarIdAleatorio(); // Gera um ID único
        const qrData = `${nome}-${id}`; // Combina nome e ID

        // Gerando o QR Code
        QRCode.toDataURL(qrData, function (err, url) {
            if (err) throw err;
            salvarQRCode(nome, url, qrData); // Salva o QR Code com o nome, URL e dados
        });
    } else {
        alert('Por favor, insira um nome.');
    }
}

// Função para salvar o QR Code no localStorage
function salvarQRCode(nome, url, qrData) {
    let convites = JSON.parse(localStorage.getItem('convites')) || [];
    convites.push({ nome, url, qrData, status: 'pendente' }); // Adiciona status
    localStorage.setItem('convites', JSON.stringify(convites));
    exibirConvites();
}

// Função para exibir os QR Codes
function exibirConvites() {
    const listaConvites = document.getElementById('lista-qrcodes');
    listaConvites.innerHTML = '';
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    
    convites.forEach(convite => {
        const div = document.createElement('div');
        div.classList.add('qrcode', 'mb-3', 'p-3', 'border', 'rounded');
        const img = document.createElement('img');
        img.src = convite.url;
        img.classList.add('img-fluid', 'mb-2');
        const nome = document.createElement('p');
        nome.textContent = `Nome: ${convite.nome}`;
        const status = document.createElement('p');
        status.textContent = `Status: ${convite.status}`;
        if (convite.status === 'validado') {
            const validadoEm = document.createElement('p');
            validadoEm.textContent = `Validado em: ${convite.validadoEm}`;
            div.appendChild(validadoEm);
        }
        div.appendChild(img);
        div.appendChild(nome);
        div.appendChild(status);
        listaConvites.appendChild(div);
    });
}

// Função para validar o QR Code
function validarQRCode(qrData) {
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    const conviteValido = convites.find(convite => convite.qrData === qrData);
    const resultadoValidacao = document.getElementById('resultado-validacao');
    
    if (conviteValido) {
        if (conviteValido.status === 'pendente') {
            conviteValido.status = 'validado';
            conviteValido.validadoEm = new Date().toLocaleString(); // Registra o horário
            localStorage.setItem('convites', JSON.stringify(convites));
            exibirConvites(); // Atualiza a lista de QR Codes
            resultadoValidacao.textContent = `Convite válido! Nome: ${conviteValido.nome}`;
            resultadoValidacao.classList.remove('text-danger');
            resultadoValidacao.classList.add('text-success');
        } else {
            resultadoValidacao.textContent = `Convite já validado em: ${conviteValido.validadoEm}`;
            resultadoValidacao.classList.remove('text-success');
            resultadoValidacao.classList.add('text-warning');
        }
    } else {
        resultadoValidacao.textContent = 'Convite inválido!';
        resultadoValidacao.classList.remove('text-success');
        resultadoValidacao.classList.add('text-danger');
    }
}

let html5QrCode;

// Função para iniciar a leitura do QR Code via câmera
function iniciarLeitura() {
    const resultadoValidacao = document.getElementById('resultado-validacao');
    resultadoValidacao.textContent = 'Aguardando escaneamento do QR Code...';
    resultadoValidacao.classList.remove('text-danger', 'text-success');

    // Inicializa o leitor de QR Code
    html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Câmera traseira do dispositivo
        { fps: 10, qrbox: 250 }, // Configuração da leitura
        (decodedText, decodedResult) => {
            // Chama a função de validação ao escanear o QR Code
            validarQRCode(decodedText);
            pararLeitura();  // Para a leitura após o sucesso
        },
        (errorMessage) => {
            console.log(errorMessage); // Para casos de erro na leitura
        }
    ).catch(err => {
        console.log("Erro ao iniciar o scanner: ", err);
    });
}

// Função para parar a leitura
function pararLeitura() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("Leitura parada com sucesso.");
        }).catch(err => {
            console.log("Erro ao parar a leitura: ", err);
        });
    }
}

// Exibir QR Codes ao carregar a página
window.onload = exibirConvites;