import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
client = Groq()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/perguntar', methods=['POST'])
def perguntar():
    dados = request.get_json()
    pergunta = dados.get('pergunta')

    if not pergunta:
        return jsonify({'erro': 'A pergunta não pode estar vazia.'}), 400

    try:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é um assistente útil. Responda sempre em português "
                        "e formate suas respostas usando Markdown (títulos com #, "
                        "listas com -, negrito com **, tabelas quando fizer sentido)."
                    )
                },
                {"role": "user", "content": pergunta}
            ],
            model="openai/gpt-oss-120b",
            max_tokens=4096
        )
        return jsonify({'resposta': completion.choices[0].message.content})

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({'erro': 'Ocorreu um erro ao processar sua pergunta.'}), 500

if __name__ == '__main__':
    app.run(debug=True)