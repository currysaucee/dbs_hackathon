from flask import Blueprint, request, jsonify
from ..models.Trade import Trade  
from ..models.Account import Account 
from ..models.Alert import Alert  

from .. import db
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload

bp = Blueprint("orders_routes", __name__)

@bp.route("/get_all_trades", methods=["GET"])
def get_all_trades():
    orders = Trade.query.all()
    return jsonify({"message": orders}), 200

@bp.route("/get_trade_by_id", methods=["GET"])
def get_trade_by_id():
    data = request.json
    id = data.get("id")
    order = Trade.query.filter_by(id=id).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404
    return jsonify(order.serialize()), 200

@bp.route("/validate_and_accept_trade", methods=["POST"])
def validate_and_accept_trade():
    data = request.json
    #model of trade
    #         "id": self.id,
    #         "uuid": self.uuid,
    #         "company": self.company,
    #         "price": self.price,
    #         "action": self.action,
    #         "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
    #         "created_by": self.created_by,
    trade_id = data['trade_id']
    trade_info = Trade.query.filter_by(id=trade_id).first()
    alert = Alert.query.filter_by(id=seller_id).first()
    if alert.alertDateTime > datetime.now():
        return jsonify({"message": "Alert has expired."}), 400
    if trade_info['action'] == 'buy':
        buyer_id = data['other_id']
        seller_id = data['my_id']
    else:
        buyer_id = data['my_id']
        seller_id = data['id']
    try:
        COST_PER_CARBON_TOKEN = 10
        total_amt_req = COST_PER_CARBON_TOKEN * trade_info.quantity 
        # check if requester has enough funds
        buyer = Account.query.filter_by(id=buyer_id).first()
        available_cashbalance_buyer = buyer_id.cashBalance
        available_carbonbalance_buyer = buyer_id.carbonBalance
        if available_cashbalance_buyer < total_amt_req:
            return jsonify({"message": "Insufficient funds."}), 400
        # check if seller has sufficient tokens
        seller = Account.query.filter_by(id=seller_id).first()
        available_cashbalance_seller = seller_id.cashBalance
        available_carbonbalance_seller = seller_id.carbonBalance
        if available_carbonbalance_seller < trade_info.quantity:
            return jsonify({"message": "Insufficient carbon tokens."}), 400
        available_carbonbalance_buyer += trade_info.quantity 
        available_carbonbalance_seller -= trade_info.quantity 
        available_cashbalance_buyer -= total_amt_req
        available_cashbalance_seller += total_amt_req
        buyer.carbonBalance = available_carbonbalance_buyer
        seller.carbonBalance = available_carbonbalance_seller
        buyer.cashBalance = available_cashbalance_buyer
        seller.cashBalance = available_cashbalance_seller
        # Set the Status of the order to be complete
        trade_info.status = "Complete"
        alert.status = "Complete"
        db.session.commit()
        return jsonify({"message": "Trade successfully Made."}), 200
    except:
        return jsonify({"message": "There was a problem creating the order."}), 400

