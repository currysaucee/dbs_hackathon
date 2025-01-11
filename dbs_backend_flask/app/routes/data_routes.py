from datetime import datetime
import uuid
from flask import Blueprint, request, jsonify
from ..models.Trade import Trade  
from ..models.Account import Account
from .. import db
from .websocket import socketio  

bp = Blueprint("data_routes", __name__)

# ACCOUNT

@bp.route("/get_all_accounts", methods=["GET"])
def get_all_accounts():
    print("hi i got hit")
    accounts = Account.query.all()
    return jsonify(accounts), 200

@bp.route("/get_account_by_id", methods=["GET"])
def get_account_by_id():
    account = Account.query.filter_by(id=request.args.get("id")).first()
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account.serialize()), 200

@bp.route("/create_account", methods=["POST"])
def create_account():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    try:
        account = Account(
            name=name,
            carbonBalance=0,
            cashBalance=0,
            email=email,
            password=password
        )
        db.session.add(account)
        db.session.commit()

        return jsonify({"message": "Account successfully created"}), 200  

    except:
        return jsonify({"error": "Missing required fields"}), 400
    
@bp.route("/update_account", methods=["PUT"])
def update_account():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    try:
        ref_account = Account.query.filter_by(email=email).first()
        ref_account.name = name
        ref_account.email = email
        db.session.commit()
        return jsonify({"message": "Account successfully updated"}), 200  

    except:
        return jsonify({"error": "There was an issue updating your account."}), 400
    
@bp.route("/delete_account", methods=["DELETE"])
def delete_account():
    data = request.json
    id = data.id
    try:
        account = Account.query.filter_by(id=id).first()
        db.session.delete()
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except:
        return jsonify({'error': 'There was an issue deleting the user.'}), 400
        






        








@bp.route("/account", methods=["GET"])
def get_account():
    account = Account.query.filter_by(email=request.args.get("email")).first()
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account.serialize()), 200

@bp.route("/get_data", methods=["GET"])
def get_data():
    print("Heyyy")
    try:
        trades = Trade.query.all() 
        trade_list = [trade.to_dict() for trade in trades]
        return jsonify(trade_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/trade", methods=["POST"])
def make_trade():
    data = request.json
    company = data.get("company")
    action = data.get("action")
    amount = data.get("amount")

    if not company or not action or not amount:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        trade = Trade(
            uuid=str(uuid.uuid4()),
            company=company,
            price=amount, 
            action=action,
            timestamp=datetime.utcnow(),
            created_by="Test User", 
        )
        db.session.add(trade)
        db.session.commit()
        
        # Broadcast the new trade to all connected WebSocket clients
        socketio.emit('new_trade', trade.to_dict())

        return jsonify({"message": "Trade successfully created"}), 200    
    except Exception as e:
        return jsonify({"error": str(e)}), 500