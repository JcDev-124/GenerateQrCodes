// Variável global para o leitor de QR Code
let html5QrCode;

// Função para iniciar a leitura do QR Code via câmera
function iniciarLeitura() {
    console.log("Função iniciarLeitura chamada!");
    const resultadoValidacao = document.getElementById('resultado-validacao');
    resultadoValidacao.textContent = 'Aguardando escaneamento do QR Code...';
    resultadoValidacao.classList.remove('text-danger', 'text-success', 'text-warning');

    // Verifica se já existe um leitor ativo
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("Leitor anterior parado, iniciando um novo...");
            iniciarScanner();
        }).catch(err => console.error("Erro ao parar o leitor anterior:", err));
    } else {
        iniciarScanner();
    }
}

// Função auxiliar para iniciar o scanner
function iniciarScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Usa a câmera traseira
        { fps: 10, qrbox: 250 }, // Configuração da leitura
        (decodedText) => {
            console.log("QR Code escaneado:", decodedText);
            validarQRCode(decodedText);
            html5QrCode.stop();
        },
        (errorMessage) => {
            console.warn("Erro na leitura do QR Code:", errorMessage);
        }
    ).catch(err => {
        console.error("Erro ao iniciar o scanner:", err);
        alert("Erro ao acessar a câmera. Verifique as permissões!");
    });
}

// Função para parar a leitura do QR Code
function pararLeitura() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            console.log("Leitura interrompida!");
            document.getElementById('resultado-validacao').textContent = 'Leitura interrompida.';
        }).catch(err => {
            console.error("Erro ao parar a leitura:", err);
        });
    }
}

// Função para validar o QR Code lido
function validarQRCode(qrData) {
    console.log("Função validarQRCode chamada com dados:", qrData);
    const convites = JSON.parse(localStorage.getItem('convites')) || [];
    const conviteValido = convites.find(convite => convite.qrData === qrData);
    const resultadoValidacao = document.getElementById('resultado-validacao');

    if (conviteValido) {
        if (conviteValido.status === 'pendente') {
            conviteValido.status = 'validado';
            conviteValido.validadoEm = new Date().toLocaleString();
            localStorage.setItem('convites', JSON.stringify(convites));
            exibirConvites();
            resultadoValidacao.textContent = `✅ Convite válido! Nome: ${conviteValido.nome}`;
            resultadoValidacao.classList.remove('text-danger', 'text-warning');
            resultadoValidacao.classList.add('text-success');
        } else {
            resultadoValidacao.textContent = `⚠️ Convite já validado em: ${conviteValido.validadoEm}`;
            resultadoValidacao.classList.remove('text-success');
            resultadoValidacao.classList.add('text-warning');
        }
    } else {
        resultadoValidacao.textContent = '❌ Convite inválido!';
        resultadoValidacao.classList.remove('text-success', 'text-warning');
        resultadoValidacao.classList.add('text-danger');
    }
}
