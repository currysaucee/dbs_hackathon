# Flask Application

## Description

This is a Python Flask application that serves as the backend for a web-based project. The app is structured with modular routes, uses SQLAlchemy as the ORM to interact with the database, and implements JWT for secure authentication. The project is designed to be easily extendable and configurable.

---

## Features

- Modular route management.
- Secure authentication with JWT tokens.
- All SQL queries are wrapped with SQLAlchemy ORM.
- Configurable database connection via the `config.py` file.
- RESTful API endpoints for various functionalities.
- There is a websocket in here if it ever needs realtime data streaming.

---

## Installation

### Prerequisites

- Python 3.8 or higher.
- A MySQL database (or any SQLAlchemy-compatible database).
- `pip` for managing Python dependencies.

### Steps

1. **Clone the Repository**:
```bash
git clone https://github.com/currysaucee/dbs_hackathon.git
cd dbs_hackathon/dbs_backend_flask
```


Install Dependencies:
```bash
pip install -r requirements.txt
```

Set Up Configuration:

Edit the config.py file with your database credentials:
```bash
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://username:password@localhost/your_database"
```
Ensure your database is accessible and matches the configuration.
Initialize the Database: Run the application to let SQLAlchemy create all required tables automatically:

Start the Flask development server:
```bash
python run.py
```
The app will be available at http://localhost:5000.