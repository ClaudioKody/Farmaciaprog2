from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database import db
from routes import register_routes


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  
    db.init_app(app)
    register_routes(app)

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Recurso no encontrado"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "Error interno del servidor"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)