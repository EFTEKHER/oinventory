from flask import Flask, request, render_template, jsonify
import joblib
import os
import requests
import json
from dotenv import load_dotenv
import pandas as pd
from flask_cors import CORS
# Load environment variables

load_dotenv()

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app, resources={r"/*": {"origins": "*"}})

# OpenRouter API Key
OPENROUTER_API_KEY = "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"

# OpenRouter API Endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"


@app.route("/")
def home():
    return 


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        image_url = data.get("image_url", "").strip()

        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400

        # Prepare messages payload
        messages = [{"role": "user", "content": user_message}]

        if image_url:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": user_message},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            })

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "qwen/qwen2.5-vl-72b-instruct:free",
            "messages": messages,
            "top_p": 1,
            "temperature": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "repetition_penalty": 1,
            "top_k": 0
        }

        response = requests.post(OPENROUTER_API_URL, headers=headers, data=json.dumps(payload))
        result = response.json()

        if "choices" in result and len(result["choices"]) > 0:
            bot_reply = result["choices"][0]["message"]["content"].strip()
        else:
            bot_reply = "Sorry, I couldn't process your request."

        return jsonify({"reply": bot_reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)