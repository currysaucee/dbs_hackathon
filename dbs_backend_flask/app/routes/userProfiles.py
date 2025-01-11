from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import db
from app.models.Account import Account

bp = Blueprint("data_routes", __name__)

@bp.route("/getCompanyDetails", methods=["GET"])
def getCompanyDetails():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Company ID is required"}), 400
    company = Account.query.filter_by(id=id).first()
    if not company:
        return jsonify({"error": f"Company with ID {id} not found"}), 404

    return jsonify(company.toDict()), 200

@bp.route("/get", methods=["GET"])
def getCreditBalance():
    return jsonify({"status": "OK"}), 200

@bp.route("/get", methods=["GET"])
def getCashBalance():
    return jsonify({"status": "OK"}), 200