from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
PORT = os.getenv("PORT")
if PORT is not None:
    PORT = int(PORT)
else:
    PORT = 8000
CORS(app)


@app.route("/")
def hello():
    return "Hello, Backend World!"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)
