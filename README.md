# 🤖 Clone de Chat com IA (Groq + Flask)

Este projeto é uma aplicação web conversacional desenvolvida com **Python (Flask)** no backend, **JavaScript puro** no frontend e estilizada com **CSS**. A inteligência do chat é alimentada pela **API da Groq** utilizando o modelo `openai/gpt-oss-120b`.

O projeto foi projetado com foco didático, priorizando código simples, bem comentado e de fácil compreensão para quem está aprendendo desenvolvimento web com Python.

---

## 📁 Estrutura de Arquivos

Para o Flask funcionar corretamente, os arquivos devem estar organizados na seguinte estrutura de pastas:

```text
chatbot-groq-ia/
│
├── app.py                # Servidor backend em Flask
├── .env                  # Guarda as variáveis de ambiente (Chave da API)
├── requirements.txt      # Dependências do projeto Python
│
├── templates/
│   └── index.html        # Estrutura HTML da página
│
└── static/
    ├── index.css         # Estilos e formatação visual
    └── index.js          # Lógica do frontend e requisições HTTP
```

---

## 🛠️ Tecnologias Utilizadas

- **Python 3.x**
- **Flask**: Framework web leve para Python.
- **Groq SDK**: Biblioteca oficial para integração com os modelos de IA da Groq.
- **JavaScript (ES6+)**: Manipulação do DOM e requisições assíncronas com `fetch`.
- **Marked.js**: Biblioteca via CDN para converter respostas em Markdown da IA em HTML formatado.
- **CSS3**: Layout moderno com Flexbox.

---

## 🚀 Como Executar o Projeto

### 1. Clonar ou Baixar o Repositório
Certifique-se de estar na pasta raiz do projeto no seu terminal.

### 2. Criar e Ativar o Ambiente Virtual (`.venv`)
No terminal, execute:

- **Linux / macOS:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

- **Windows:**
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate
  ```

### 3. Instalar as Dependências
Com o ambiente virtual ativado, instale as bibliotecas necessárias:

```bash
pip install -r requirements.txt
```

> **Nota:** O `requirements.txt` especifica a versão do `httpx` (`httpx<0.28.0`) para evitar incompatibilidades conhecidas com a biblioteca do Groq.

### 4. Configurar a Chave da API da Groq
1. Obtenha uma chave gratuita em [Console Groq API](https://console.groq.com/keys).
2. Crie ou edite o arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
GROQ_API_KEY=cole_sua_chave_aqui
```

### 5. Iniciar o Servidor
Execute a aplicação Flask:

```bash
python app.py
```

O servidor iniciará em modo de desenvolvimento. Acesse no seu navegador:
👉 `http://127.0.0.1:5000`

---

## 💡 Como o Projeto Funciona (Visão Geral)

1. **Envio da Mensagem:** O usuário digita um prompt no campo de texto e envia.
2. **Interface Assíncrona:** O JavaScript bloqueia múltiplos envios, adiciona o balão com a pergunta do usuário na tela e exibe o indicador de carregamento ("Buscando resposta...").
3. **Comunicação com o Backend:** O `index.js` faz uma chamada `POST` (via `fetch`) para a rota `/api/chat` do Flask.
4. **Consulta à IA:** O Flask recebe a mensagem, envia para a API do Groq e aguarda o retorno do modelo LLM.
5. **Renderização do Markdown:** Ao receber a resposta da API, o JavaScript remove o indicador de carregamento e usa a biblioteca `Marked.js` para renderizar textos em negrito, tabelas, listas e blocos de código formatados na tela.