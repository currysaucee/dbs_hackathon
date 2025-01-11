from app import db

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    accountId = db.Column(db.Integer, nullable=False)
    alertDateTime = db.Column(db.DateTime, nullable=False)
    alertText = db.Column(db.String(120), nullable=False)
    alertStatus = db.Column(db.String(120), nullable=False)
