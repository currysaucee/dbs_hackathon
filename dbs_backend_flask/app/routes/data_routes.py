from datetime import datetime
import uuid
from flask import Blueprint, request, jsonify
from ..models.Trade import Trade  
from .. import db
from .websocket import socketio  

bp = Blueprint("data_routes", __name__)

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