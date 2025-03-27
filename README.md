# Validador de QR Codes - Festa

## Descrição
O **Validador de QR Codes - Festa** é um sistema desenvolvido para facilitar a gestão de convites para eventos. Ele permite a criação de QR Codes exclusivos para cada convidado e a validação dos mesmos através da câmera do dispositivo. O objetivo é garantir um controle de acesso eficiente e seguro.

## Funcionalidades
- **Gerar QR Code**: Permite a criação de convites para convidados.
- **Listar Convites Criados**: Exibe todos os convites gerados e permite busca.
- **Validar QR Code**: Faz a leitura e verifica se o convite é válido.
- **Interface Responsiva**: Desenvolvido com Bootstrap para compatibilidade com dispositivos móveis.

## Tecnologias Utilizadas
- **HTML5**: Estrutura do sistema.
- **CSS3**: Estilização e responsividade.
- **JavaScript**: Funcionalidades e interatividade.
- **Bootstrap 5**: Layout responsivo.
- **html5-qrcode**: Biblioteca para leitura de QR Codes.
- **qrcode.js**: Geração de QR Codes dinâmicos.

## Como Usar
1. **Acessar o Sistema**: Basta abrir o arquivo `index.html` em um navegador.
2. **Criar um Convite**: Insira o nome do convidado e clique em "Gerar QR Code".
3. **Listar e Pesquisar Convites**: Utilize o campo de pesquisa para encontrar convites.
4. **Validar QR Code**: Inicie a câmera e escaneie o código para verificação.

## Estrutura do Projeto
```
/
|-- index.html       # Arquivo principal
|-- styles.css       # Estilos personalizados
|-- script.js        # Lógica do sistema
|-- /assets          # Pasta para armazenar imagens e QR Codes
```

## Dependências
O sistema utiliza bibliotecas externas, carregadas via CDN:
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [qrcode.js](https://github.com/davidshimjs/qrcodejs)
- [Bootstrap 5](https://getbootstrap.com/)

## Contribuição
Caso deseje contribuir, sinta-se à vontade para abrir um pull request ou relatar problemas na seção de issues.

## Licença
Este projeto está sob a licença MIT.
