// Função para gerar o QR Code
function gerarQRCode() {
    const nome = document.getElementById('nome').value;

    if (nome) {
        // Gerando o QR Code
        QRCode.toDataURL(nome, function (err, url) {
            if (err) throw err;
            salvarQRCode(nome, url);
        });
    } else {
        alert('Por favor, insira um nome.');
    }
}

// Função para salvar o QR Code no localStorage
function salvarQRCode(nome, url) {
    let convites = JSON.parse(localStorage.getItem('convites')) || [];
    convites.push({ nome, url });
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
        div.classList.add('qrcode');
        const img = document.createElement('img');
        img.src = convite.url;
        const nome = document.createElement('p');
        nome.textContent = `Nome: ${convite.nome}`;
        div.appendChild(img);
        div.appendChild(nome);
        listaConvites.appendChild(div);
    });
}

// Função para validar o QR Code
function validarQRCode(qrData) {
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    const conviteValido = convites.find(convite => convite.nome === qrData);
    const resultadoValidacao = document.getElementById('resultado-validacao');
    
    if (conviteValido) {
        resultadoValidacao.textContent = `Convite válido! Nome: ${conviteValido.nome}`;
        resultadoValidacao.classList.remove('text-danger');
        resultadoValidacao.classList.add('text-success');
    } else {
        resultadoValidacao.textContent = 'Convite inválido!';
        resultadoValidacao.classList.remove('text-success');
        resultadoValidacao.classList.add('text-danger');
    }
}

// Função para iniciar a leitura do QR Code via câmera
function iniciarLeitura() {
    const resultadoValidacao = document.getElementById('resultado-validacao');
    resultadoValidacao.textContent = 'Aguardando escaneamento do QR Code...';
    resultadoValidacao.classList.remove('text-danger', 'text-success');

    // Inicializa o leitor de QR Code
    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Câmera traseira do dispositivo
        { fps: 10, qrbox: 250 }, // Configuração da leitura
        (decodedText, decodedResult) => {
            // Chama a função de validação ao escanear o QR Code
            validarQRCode(decodedText);
            html5QrCode.stop();  // Para a leitura após o sucesso
        },
        (errorMessage) => {
            console.log(errorMessage); // Para casos de erro na leitura
        }
    ).catch(err => {
        console.log("Erro ao iniciar o scanner: ", err);
    });
}

// Exibir QR Codes ao carregar a página
window.onload = exibirConvites;
