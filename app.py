import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq

# Carrega as variáveis de ambiente cadastradas no ficheiro .env
load_dotenv()

# Inicializa a aplicação Flask
app = Flask(__name__)

# Recupera a chave da API do Groq das variáveis de ambiente
chave_api = os.getenv("GROQ_API_KEY")

# Inicializa o cliente oficial da API do Groq
cliente_groq = Groq(api_key=chave_api)


@app.route("/")
def index():
    """Rota principal que carrega a interface da página web."""
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    """Rota da API que recebe o prompt do utilizador e envia para a IA do Groq."""
    try:
        # Extrai o JSON enviado pela requisição do JavaScript
        dados = request.get_json()
        prompt_utilizador = dados.get("prompt", "")

        # Verifica se o prompt não está vazio
        if not prompt_utilizador:
            return jsonify({"erro": "O prompt não pode estar vazio."}), 400

        # Envia a mensagem para a API do Groq usando o modelo llama-3.3-70b-versatile
        resposta_groq = cliente_groq.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt_utilizador,
                }
            ],
            model="openai/gpt-oss-120b",
        )

        # Extrai o texto gerado pela resposta da IA
        texto_resposta = resposta_groq.choices[0].message.content

        # Retorna a resposta no formato JSON para o JavaScript
        return jsonify({"resposta": texto_resposta})

    except Exception as erro:
        # Em caso de falha na requisição ou chave inválida, retorna a mensagem de erro
        return jsonify({"erro": str(erro)}), 500


if __name__ == "__main__":
    # Executa o servidor Flask em modo de desenvolvimento
    app.run(debug=True)