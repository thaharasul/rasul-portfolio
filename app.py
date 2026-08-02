from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText

load_dotenv()

app = Flask(__name__)

# Same-origin now (frontend + backend on same server) — CORS not strictly needed,
# but harmless to keep for now while testing
CORS(app)

EMAIL = os.getenv("EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")

from flask import send_from_directory

@app.route("/robots.txt")
def robots():
    return send_from_directory(".", "robots.txt")

@app.route("/sitemap.xml")
def sitemap():
    return send_from_directory(".", "sitemap.xml")
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.json
        print("CONTACT DATA:", data)

        body = f"""
New Portfolio Contact

Name: {data['name']}
Email: {data['email']}
Subject: {data['subject']}

Message:

{data['message']}
"""
        msg = MIMEText(body)
        msg["Subject"] = "Portfolio Contact Form"
        msg["From"] = EMAIL
        msg["To"] = EMAIL

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL, APP_PASSWORD)
            smtp.send_message(msg)

        return jsonify({"success": True, "message": "Email sent successfully"})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
