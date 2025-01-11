from flask import Blueprint, request, jsonify
from ..models.Order import Order  
from .. import db

bp = Blueprint("orders_routes", __name__)

bp.route("/order", methods=["POST"])
def make_order():
    data = request.json
    companyID = data.get("companyID")
    activeAccount = data.get("activeAccount")
    cashBalance = data.get("cashBalance")
    carbonBalance = data.get("carbonBalance")
    
    if not companyID:
        return jsonify({"error": "No valid company"}), 400
    elif activeAccount < 1 or cashBalance < 1 or carbonBalance < 1:
        return jsonify({"error": "No active account"}), 400
    
    try:
        order = Order()
    except Exception as e:
        return jsonify({"error": str(e)}), 500