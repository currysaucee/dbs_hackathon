from app import db
from flask import jsonify, request

class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    carbonBalance = db.Column(db.Float, nullable=False)
    cashBalance = db.Column(db.Float, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
