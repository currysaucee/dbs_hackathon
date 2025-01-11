from flask import Blueprint, request, jsonify
from ..models.Order import Order  
from ..models.Alert import Alert
from .. import db
from datetime import datetime, timedelta

bp = Blueprint("orders_routes", __name__)

@bp.route("/get_all_orders", methods=["GET"])
def get_all_orders():
    orders = Order.query.all()
    return jsonify(orders), 200

@bp.route("/get_order_by_id/<string:id>", methods=["GET"])
def get_order_by_id(id):
    order = Order.query.filter_by(id=id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.serialize()), 200

@bp.route("/create_order", methods=["POST"])
def create_order():
    data = request.json

    try:
        new_alert = Alert(
            accountId = data.get("receiverId"),
            alertDateTime = datetime.now() + timedelta(days=10),
            alertText = f"You have yet to approve {data.get("requestorId")}'s request to {data.get("requestType")} {data.get("carbon_quantity")} units of carbon.",
            alertStatus = "Scheduled"
        )
        
        new_order = Order(
            requestor_id = data.get("requestorId"),
            receiver_id = data.get("receiverId"),
            alert_id = new_alert.id,
            carbonQuantity = data.get("carbonQuantity"),
            status = "Active",
            createdAt = datetime.now(),
            updatedAt = None,
            requestType = data.get("requestType"),
            requestReason = data.get("requestReason"),
            rejectReason = data.get("rejectReason")
        )

        db.session.add(new_order)
        db.session.commit()

        return jsonify("Order successfully created."), 200
    
    except:
        return jsonify("There was a problem creating the order."), 400


@bp.route("/deleteOrder/<string:id>", methods=["DELETE"])
def delete_Order(id):
    order = Order.query.filter_by(id=id).first()

    if not order:
        return jsonify({"error": "Order with ID not found and cannot be deleted"}), 404

    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order successfully deleted."}), 200