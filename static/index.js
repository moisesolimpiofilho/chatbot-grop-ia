// Captura dos elementos do DOM
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');

// Escuta o evento de envio do formulário
chatForm.addEventListener('submit', async (e) => {
    // Impede o recarregamento padrão da página ao enviar o formulário
    e.preventDefault();

    // Obtém o texto digitado e remove espaços extras no início e no fim
    const text = userInput.value.trim();

    // Se o campo estiver vazio, interrompe a execução
    if (!text) return;

    // 1. Exibe a mensagem do usuário na tela
    appendMessage(text, 'user');

    // Limpa o campo de entrada
    userInput.value = '';

    // 2. Exibe o indicador de carregamento (loading)
    const loadingId = appendLoading();

    // Desabilita o botão de enviar enquanto aguarda a resposta
    sendBtn.disabled = true;

    try {
        // 3. Faz a requisição POST para a API do Flask
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: text })
        });

        const data = await response.json();

        // Remove o balão de carregamento assim que obtém o retorno
        removeLoading(loadingId);

        if (response.ok) {
            // Exibe a resposta recebida da IA
            appendMessage(data.resposta, 'bot');
        } else {
            // Exibe a mensagem de erro retornada pelo backend
            appendMessage(`Erro: ${data.erro}`, 'bot');
        }

    } catch (error) {
        // Trata erros de rede ou falha de conexão com o servidor Flask
        removeLoading(loadingId);
        appendMessage('Erro ao conectar com o servidor.', 'bot');
    } finally {
        // Reabilita o botão de enviar
        sendBtn.disabled = false;
    }
});

/**
 * Função responsável por criar e adicionar uma nova mensagem no chat.
 * @param {string} text - O conteúdo da mensagem.
 * @param {string} sender - Quem enviou ('user' ou 'bot').
 */
function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Se a mensagem for do bot, converte a sintaxe Markdown para HTML.
    // Se for do usuário, insere como texto simples para evitar riscos de XSS.
    if (sender === 'bot') {
        messageElement.innerHTML = marked.parse(text);
    } else {
        messageElement.textContent = text;
    }

    // Adiciona o elemento na caixa de mensagens
    chatBox.appendChild(messageElement);

    // Rola a caixa de mensagens para o final para mostrar a mensagem mais recente
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Cria o elemento visual de carregamento (loading).
 * @returns {string} ID único do elemento criado para posterior remoção.
 */
function appendLoading() {
    const loadingElement = document.createElement('div');
    const loadingId = 'loading-' + Date.now();
    
    loadingElement.id = loadingId;
    loadingElement.classList.add('message', 'bot', 'loading');
    loadingElement.textContent = 'Buscando resposta...';

    chatBox.appendChild(loadingElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    return loadingId;
}

/**
 * Remove o elemento de carregamento da tela pelo seu ID.
 * @param {string} loadingId - O ID do elemento a ser removido.
 */
function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}