from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from .routes.websocket import init_socketio
from .config import Config
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"error": "Missing or invalid token"}), 401

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)  # Initialize SQLAlchemy
    jwt.init_app(app)  # Initialize JWT

    with app.app_context():
        from .routes.auth_routes import bp as auth_routes
        from .routes.data_routes import bp as data_routes
        
        app.register_blueprint(auth_routes, url_prefix="/auth")
        app.register_blueprint(data_routes, url_prefix="/data")  # Register data_routes
        # db.create_all()  # Create database tables
        
        init_socketio(app)


    return app
