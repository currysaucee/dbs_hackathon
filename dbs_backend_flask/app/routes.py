from datetime import datetime, timedelta
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models.User import User
from .models.Token import Token
from .utils import hash_password, verify_password
from . import db

bp = Blueprint("routes", __name__)

@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"}), 200

@bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = hash_password(data["password"])
    new_user = User(email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and verify_password(user.password, data["password"]):
        access_token = create_access_token(identity={"id": user.id, "email": user.email})
        refresh_token = str(uuid.uuid4())  # Generate a unique token

        # Save refresh token in the database
        token = Token(
            user_id=user.id,
            refresh_token=refresh_token,
            issued_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        db.session.add(token)
        db.session.commit()

        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    return jsonify({"error": "Invalid credentials"}), 401

@bp.route("/refresh", methods=["POST"])
def refresh():
    data = request.json
    refresh_token = data.get("refresh_token")

    # Validate the refresh token
    token = Token.query.filter_by(refresh_token=refresh_token).first()
    if not token or token.expires_at < datetime.utcnow():
        return jsonify({"error": "Refresh token expired. Please log in again."}), 401

    # Generate a new access token
    user = User.query.get(token.user_id)
    access_token = create_access_token(identity={"id": user.id, "email": user.email})

    return jsonify(access_token=access_token), 200

@bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    data = request.json
    refresh_token = data.get("refresh_token")

    # Remove the refresh token from the database
    token = Token.query.filter_by(refresh_token=refresh_token).first()
    if token:
        db.session.delete(token)
        db.session.commit()

    return jsonify({"message": "Logged out successfully."}), 2000

@bp.route("/dummy", methods=["GET"])
@jwt_required()
def dummy():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello {current_user['email']}!"}), 200
