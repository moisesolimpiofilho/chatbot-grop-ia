document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('prompt-input');
    const botaoEnviar = document.getElementById('enviar-btn');
    const botaoExportar = document.getElementById('exportar-btn');
    const chatMessages = document.getElementById('chat-messages');

    // ===== Adiciona uma mensagem no chat =====
    function adicionarMensagem(tipo, conteudo, isHTML = false) {
        const div = document.createElement('div');
        div.classList.add('mensagem', tipo);

        if (isHTML) {
            div.innerHTML = conteudo;
        } else {
            div.textContent = conteudo;
        }

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    // ===== Indicador "digitando..." =====
    function mostrarDigitando() {
        const div = document.createElement('div');
        div.classList.add('mensagem', 'bot', 'digitando');
        div.innerHTML = '<span class="ponto"></span><span class="ponto"></span><span class="ponto"></span>';
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    // ===== Envia a pergunta =====
    async function enviarPergunta() {
        const pergunta = inputElement.value.trim();

        if (!pergunta) {
            alert('Por favor, digite uma pergunta.');
            return;
        }

        adicionarMensagem('user', pergunta);
        inputElement.value = '';
        botaoEnviar.disabled = true;

        const digitandoEl = mostrarDigitando();

        try {
            const response = await fetch('/perguntar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pergunta: pergunta })
            });

            const data = await response.json();
            digitandoEl.remove();

            if (!response.ok) {
                throw new Error(data.erro || 'Erro desconhecido no servidor');
            }

            const htmlBruto = marked.parse(data.resposta);
            const htmlSeguro = DOMPurify.sanitize(htmlBruto);
            adicionarMensagem('bot', htmlSeguro, true);

        } catch (error) {
            console.error('Erro:', error);
            digitandoEl.remove();
            adicionarMensagem('bot', 'Erro: ' + error.message);
        } finally {
            botaoEnviar.disabled = false;
            inputElement.focus();
        }
    }

    // ===== Exporta a conversa em PDF =====
    function exportarPDF() {
        // 1. Clona a área do chat para não alterar o que está na tela
        const chatClone = chatMessages.cloneNode(true);

        // 2. Remove o "digitando..." se ainda estiver visível
        const digitando = chatClone.querySelector('.digitando');
        if (digitando) digitando.remove();

        // 3. Adiciona cabeçalho com título e data no PDF
        const agora = new Date().toLocaleString('pt-BR');
        const cabecalho = document.createElement('div');
        cabecalho.classList.add('pdf-cabecalho');
        cabecalho.innerHTML = `
            <h1>Conversa com IA — Groq</h1>
            <p>Exportado em: ${agora}</p>
            <hr>
        `;
        chatClone.insertBefore(cabecalho, chatClone.firstChild);

        // 4. Aplica classe especial para o estilo do PDF
        chatClone.classList.add('pdf-mode');

        // 5. Configurações do PDF
        const opcoes = {
            margin:       10,               // margem em mm
            filename:     'conversa-ia.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // evita cortar balões
        };

        // 6. Gera e baixa o PDF
        html2pdf().set(opcoes).from(chatClone).save();
    }

    // ===== Eventos =====
    botaoEnviar.addEventListener('click', enviarPergunta);
    botaoExportar.addEventListener('click', exportarPDF);

    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            enviarPergunta();
        }
    });
});