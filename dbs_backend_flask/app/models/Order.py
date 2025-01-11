from app import db

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    requestorId = db.Column(db.Integer, nullable=False)
    receiverId = db.Column(db.Integer, nullable=False)
    alertId = db.Column(db.Integer, nullable=True)
    carbonUnitPrice = db.Column(db.Float, nullable=False)
    carbonQuantity = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(120), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False)
    updatedAt = db.Column(db.DateTime, nullable=False)
    requestType = db.Column(db.String(120), nullable=False)
    requestReason = db.Column(db.String(120), nullable=True)
    rejectReason = db.Column(db.String(120), nullable=True)
    
