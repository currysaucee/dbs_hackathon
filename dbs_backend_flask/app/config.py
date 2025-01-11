import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30) 
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24) 
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'mysql+pymysql://admin:Bankappdev25@bank-app-db.c5uw8so8cf26.ap-southeast-2.rds.amazonaws.com:3306/techtrek2025')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    