// Função para gerar o QR Code
function gerarQRCode() {
    console.log("Função gerarQRCode chamada!");
    const nome = document.getElementById('nome').value;

    if (nome) {
        const id = Math.random().toString(36).substr(2, 9);
        const qrData = `${nome}-${id}`;

        // Criando um elemento temporário para armazenar o QR Code
        const divQRCode = document.createElement('div');
        const qrcode = new QRCode(divQRCode, {
            text: qrData,
            width: 128,
            height: 128
        });

        // Esperar um momento para garantir que o QR Code foi renderizado
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

// Função para exibir QR Codes
function exibirConvites() {
    const listaConvites = document.getElementById('lista-qrcodes');
    listaConvites.innerHTML = '';
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    
    convites.forEach(convite => {
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
            <div class="qrcode">
                <img src="${convite.url}" class="img-fluid mb-2">
                <p>Nome: ${convite.nome}</p>
                <p>Status: ${convite.status}</p>
            </div>
        `;
        listaConvites.appendChild(div);
    });
}

// Exibir QR Codes ao carregar a página
window.onload = exibirConvites;
