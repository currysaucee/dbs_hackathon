from .. import db
import uuid
from datetime import datetime

class Trade(db.Model):
    __tablename__ = 'trades'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(36), default=str(uuid.uuid4()), unique=True, nullable=False)
    company = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    action = db.Column(db.String(4), nullable=False)  # 'buy' or 'sell'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "company": self.company,
            "price": self.price,
            "action": self.action,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "created_by": self.created_by,
        }
