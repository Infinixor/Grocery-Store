
from flask import Flask, request, jsonify


app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello():
    return "Hi How are you "


if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)