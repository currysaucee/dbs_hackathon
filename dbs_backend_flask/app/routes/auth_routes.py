from datetime import datetime, timedelta
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from ..models.Account import Account
from ..models.Token import Token
from ..utils import hash_password, verify_password
from .. import db
from ..config import Config 
bp = Blueprint("auth_routes", __name__)

@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"}), 200

@bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = hash_password(data["password"])
    new_user = Account(email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Account registered successfully"}), 200

@bp.route("/login", methods=["POST"])
def login():
    data = request.json

    account = Account.query.filter_by(email=data["email"]).first()
    if not account or not verify_password(account.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"id": account.id, "email": account.email}, expires_delta=Config.JWT_ACCESS_TOKEN_EXPIRES)
    refresh_token = create_refresh_token(identity={"id": account.id, "email": account.email}, expires_delta=Config.JWT_REFRESH_TOKEN_EXPIRES)

    Token.query.filter_by(user_id=account.id).delete()

    token = Token(
        user_id=account.id,
        refresh_token=refresh_token,
        issued_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + Config.JWT_REFRESH_TOKEN_EXPIRES,
    )
    db.session.add(token)
    db.session.commit()

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

@bp.route("/refresh", methods=["POST"])
def refresh():
    data = request.json
    refresh_token = data.get("refresh_token")

    token = Token.query.filter_by(refresh_token=refresh_token).first()

    if not token or token.expires_at < datetime.utcnow():
        if token:
            db.session.delete(token)
            db.session.commit()

        return jsonify({"error": "Refresh token expired. Please log in again."}), 401

    account = Account.query.get(token.user_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    access_token = create_access_token(
        identity={"id": account.id, "email": account.email}, 
        expires_delta=timedelta(seconds=10)
    )

    return jsonify(access_token=access_token), 200



@bp.route("/logout", methods=["POST"])
def logout():
    data = request.json
    refresh_token = data.get("refresh_token")  

    if not refresh_token:
        return jsonify({"error": "Refresh token is missing."}), 400

    token = Token.query.filter_by(refresh_token=refresh_token).first()
    if token:
        db.session.delete(token)
        db.session.commit()
        return jsonify({"message": "Logged out successfully."}), 200

    return jsonify({"error": "Invalid refresh token."}), 400

@bp.route("/dummy", methods=["GET"])
@jwt_required()
def dummy():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Hello {current_user['email']}!"}), 200
