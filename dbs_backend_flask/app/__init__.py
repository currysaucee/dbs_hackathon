from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)  # Initialize SQLAlchemy
    jwt.init_app(app)  # Initialize JWT

    with app.app_context():
        from .routes import bp
        app.register_blueprint(bp)  # Register routes
        db.create_all()  # Create database tables

    return app
