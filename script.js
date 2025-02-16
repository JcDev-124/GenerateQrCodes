    // Função para gerar o QR Code
    function gerarQRCode() {
        console.log("⚙️ Função gerarQRCode chamada!");
        const nome = document.getElementById('nome').value.trim();
        if (nome) {
          const id = Math.random().toString(36).substr(2, 9);
          const qrData = `${nome.replace(/\s+/g, "_")}-${id}`;
          const divQRCode = document.createElement('div');
          const qr = new QRCode(divQRCode, {
            text: qrData,
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.H
          });
          setTimeout(() => {
            const canvas = divQRCode.querySelector("canvas");
            if (canvas) {
              const qrUrl = canvas.toDataURL("image/png");
              salvarQRCode(nome, qrUrl, qrData);
            } else {
              console.error("❌ Erro: QR Code não foi gerado corretamente.");
            }
          }, 500);
        } else {
          alert('⚠️ Por favor, insira um nome.');
        }
      }
  
      // Salva o convite no localStorage e exibe a lista
      function salvarQRCode(nome, url, qrData) {
        let convites = JSON.parse(localStorage.getItem('convites')) || [];
        convites.push({ nome, url, qrData, status: 'pendente' });
        localStorage.setItem('convites', JSON.stringify(convites));
        exibirConvites();
      }
  
      // Compartilha o QR Code, se suportado pelo dispositivo
      function compartilharQRCode(nome, qrUrl) {
        fetch(qrUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `${nome}-qrcode.png`, { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                title: `Convite para ${nome}`,
                text: `Olá ${nome}, aqui está seu QR Code para o evento!`,
                files: [file]
              }).then(() => console.log("Compartilhamento concluído!"))
                .catch(error => console.error("Erro ao compartilhar:", error));
            } else {
              alert("Compartilhamento não suportado neste dispositivo. Tente baixar a imagem manualmente.");
            }
          })
          .catch(error => console.error("Erro ao obter o QR Code:", error));
      }
  
      // Exclui o convite pelo índice
      function excluirConvite(index) {
        let convites = JSON.parse(localStorage.getItem('convites')) || [];
        convites.splice(index, 1);
        localStorage.setItem('convites', JSON.stringify(convites));
        exibirConvites();
      }
  
      function exibirConvites() {
        const listaConvites = document.getElementById('lista-qrcodes');
        listaConvites.innerHTML = '';
        const convites = JSON.parse(localStorage.getItem('convites')) || [];
    
        convites.forEach((convite, index) => {
            const div = document.createElement('div');
            div.classList.add('col-12', 'col-md-6', 'col-lg-4');
            div.innerHTML = `
                <div class="p-3 border rounded bg-white shadow-sm text-center">
                    <strong class="text-primary d-block mb-2">${convite.nome}</strong>
                    <span class="badge ${convite.status === 'pendente' ? 'bg-warning' : 'bg-success'} d-block mb-3">
                        ${convite.status}
                    </span>
                    <button class="btn btn-info w-100 mb-2" onclick="compartilharQRCode('${convite.nome}', '${convite.url}')">
                        📲 Compartilhar
                    </button>
                    <button class="btn btn-danger w-100" onclick="excluirConvite(${index})">
                        🗑️ Excluir
                    </button>
                </div>
            `;
            listaConvites.appendChild(div);
        });
    }
  
    function filtrarConvites() {
        const searchValue = document.getElementById('searchInput').value.toLowerCase();
        const cards = document.querySelectorAll("#lista-qrcodes > div");
        cards.forEach(card => {
          const title = card.querySelector('strong').textContent.toLowerCase();
          card.style.display = title.includes(searchValue) ? "" : "none";
        });
      }
      
      
  
      // Variável que armazena a instância do scanner
      let html5QrCode = null;
  
      // Inicia a leitura do QR Code e desce a página para a área da câmera
      function iniciarLeitura() {
        console.log("📷 Iniciando leitura do QR Code...");
        const resultadoValidacao = document.getElementById('resultado-validacao');
        resultadoValidacao.textContent = '🔍 Aguardando escaneamento do QR Code...';
  
        if (html5QrCode) {
          html5QrCode.stop().then(() => {
            html5QrCode = null;
            iniciarScanner();
          }).catch(err => {
            console.error("❌ Erro ao parar scanner:", err);
            html5QrCode = null;
            iniciarScanner();
          });
        } else {
          iniciarScanner();
        }
        // Desce a página para a área da câmera
        setTimeout(() => {
          document.getElementById("camera-container").scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
  
      // Cria e inicia a instância do scanner
      function iniciarScanner() {
        console.log("📡 Criando nova instância do scanner...");
        if (html5QrCode) {
          html5QrCode.stop().catch(err => console.warn("Erro ao parar scanner:", err));
          html5QrCode = null;
        }
        html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            console.log("✅ QR Code escaneado:", decodedText);
            validarQRCode(decodedText);
          },
          (errorMessage) => {
            console.warn("⚠️ Nenhum QR Code detectado. Ajuste a câmera...");
          }
        ).catch(err => {
          console.error("❌ Erro ao iniciar scanner:", err);
          alert("⚠️ Verifique as permissões da câmera!");
        });
      }
  
      // Para a leitura do QR Code
      function pararLeitura(text) {
        if (html5QrCode) {
          html5QrCode.stop().then(() => {
            console.log("🛑 Leitura interrompida!");
            document.getElementById('resultado-validacao').textContent = text ? text : "🛑 Leitura interrompida!";
            html5QrCode = null;
          }).catch(err => {
            console.error("Erro ao parar a leitura:", err);
          });
        } else {
          console.log("⚠️ Nenhum scanner ativo para parar.");
        }
      }
  
      // Valida o QR Code escaneado comparando com os convites salvos
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
            pararLeitura("Convite validado");
          } else {
            resultadoValidacao.textContent = `⚠️ Convite já validado em: ${conviteValido.validadoEm}`;
            resultadoValidacao.classList.remove('text-success');
            resultadoValidacao.classList.add('text-warning');
            pararLeitura(`⚠️ Convite já validado em: ${conviteValido.validadoEm}`);
          }
        } else {
          resultadoValidacao.textContent = '❌ Convite inválido!';
          resultadoValidacao.classList.remove('text-success', 'text-warning');
          resultadoValidacao.classList.add('text-danger');
        }
      }
  
      // Carrega os convites ao iniciar a página
      window.onload = function() {
        exibirConvites();
        console.log("📜 Convites carregados na inicialização!");
      };