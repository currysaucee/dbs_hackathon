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

    def __init__(self, name=None, email=None, password=None, carbonBalance=0, cashBalance=0):
        self.name = name
        self.email = email
        self.password = password
        self.carbonBalance = carbonBalance
        self.cashBalance = cashBalance

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "carbonBalance": self.carbonBalance,
            "cashBalance": self.cashBalance,
            "email": self.email,
            "password": self.password
        }

    # def json(self):
    #     return {
    #         "mid": self.mid,
    #         "sid": self.sid,
    #         "name": self.name,
    #         "location": self.location,
    #         "country": self.country,
    #         "iso":self.iso,
    #     }
