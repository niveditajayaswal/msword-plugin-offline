from flask import Flask, request, jsonify, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from datetime import datetime
import os
import time


app = Flask(__name__)
cors = CORS(app)
app.secret_key = "your_secret_key"  # Required for session handling
app.config["SECRET_KEY"] = "your_secret_key"
socketio = SocketIO(app, cors_allowed_origins="*")


if not os.path.exists("text.txt"):
    with open("text.txt", "w") as file:
        file.write(f"This is a test text at {datetime.now()}")


@app.route("/save_text", methods=["POST"])
def save_text():
    data = request.get_json()
    text = data["text"]
    with open("text.txt", "w") as file:
        file.write(f"\n{text} at {datetime.now()}")

    return jsonify({"message": "Text saved"}), 200


@socketio.on("connect")
def on_connect():
    print("SocketIO connection established")
    emit("message", {"info": "SocketIO connection established"})


@socketio.on("start_stream")
def on_start_stream():
    with open("text.txt", "r") as file:
        text = file.read()
        for line in text.split("\n"):
            for word in line.split(" "):
                time.sleep(0.25)
                print(word)
                emit("message", {"text": word + " "})


if __name__ == "__main__":
    socketio.run(app, debug=True)
