#!/usr/bin/env python3
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import storage, db
from os import getenv
from dotenv import load_dotenv
from flask_login import  LoginManager
from flask_jwt_extended import JWTManager
from flask_cors import CORS


db = SQLAlchemy()


app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
load_dotenv()
app.config['SECRET_KEY'] = getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = storage.get_uri()
db.init_app(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
login_manager = LoginManager(app)
jwt = JWTManager(app)


from api.auth import auth as auth_blueprint
from api.main import main as main_blueprint
app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)

