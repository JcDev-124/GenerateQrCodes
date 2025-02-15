// Função para gerar o QR Code
function gerarQRCode() {
    console.log("Função gerarQRCode chamada!");
    const nome = document.getElementById('nome').value;

    if (nome) {
        const id = Math.random().toString(36).substr(2, 9);
        const qrData = `${nome}-${id}`;

        const divQRCode = document.createElement('div');
        const qrcode = new QRCode(divQRCode, {
            text: qrData,
            width: 128,
            height: 128
        });

        setTimeout(() => {
            const img = divQRCode.querySelector("img");
            if (img) {
                salvarQRCode(nome, img.src, qrData);
            } else {
                console.error("Erro ao capturar a imagem do QR Code.");
            }
        }, 500);
    } else {
        alert('Por favor, insira um nome.');
    }
}

// Função para salvar o QR Code no localStorage
function salvarQRCode(nome, url, qrData) {
    let convites = JSON.parse(localStorage.getItem('convites')) || [];
    convites.push({ nome, url, qrData, status: 'pendente' });
    localStorage.setItem('convites', JSON.stringify(convites));
    exibirConvites();
}

// Função para exibir QR Codes na horizontal
function exibirConvites() {
    const listaConvites = document.getElementById('lista-qrcodes');
    listaConvites.innerHTML = '';
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    
    convites.forEach(convite => {
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
            <div class="d-flex align-items-center justify-content-between p-3 border rounded bg-white shadow-sm">
                <strong class="text-primary">${convite.nome}</strong>
                <span class="badge ${convite.status === 'pendente' ? 'bg-warning' : 'bg-success'}">
                    ${convite.status}
                </span>
                <button class="btn btn-sm btn-info" onclick="enviarQRCodeWhatsApp('${convite.nome}', '${convite.url}')">
                    Enviar via WhatsApp
                </button>
            </div>
        `;
        listaConvites.appendChild(div);
    });
}

// Função para enviar QR Code via WhatsApp como imagem
function enviarQRCodeWhatsApp(nome, qrUrl) {
    const whatsappMessage = `Olá, ${nome}! Aqui está o seu convite para o evento. Apresente este QR Code na entrada.`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}&media=${qrUrl}`;

    window.open(whatsappLink, '_blank');
}

// Função para validar QR Code via câmera
function iniciarLeitura() {
    console.log("Função iniciarLeitura chamada!");
    const resultadoValidacao = document.getElementById('resultado-validacao');
    resultadoValidacao.textContent = 'Aguardando escaneamento do QR Code...';

    const html5QrCode = new Html5Qrcode("qr-reader");  // Correção aqui
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code escaneado:", decodedText);
            validarQRCode(decodedText);
            html5QrCode.stop();
        },
        (errorMessage) => {
            console.error("Erro na leitura do QR Code:", errorMessage);
        }
    ).catch(err => {
        console.error("Erro ao iniciar o scanner: ", err);
    });
}

// Exibir QR Codes ao carregar a página
window.onload = exibirConvites;
