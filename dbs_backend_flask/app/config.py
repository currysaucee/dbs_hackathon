import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)  # Access token expires in 2 hours
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=24)  # Max refresh token validity