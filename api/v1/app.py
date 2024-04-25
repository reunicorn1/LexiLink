#!/usr/bin/env python3
from flask import Flask, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from models import storage, db
from os import getenv
from dotenv import load_dotenv
from flask_login import  LoginManager
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flasgger import Swagger
from sqlalchemy import create_engine, MetaData
from flask_restx import Api
from flask_migrate import Migrate
from api.v1.config import DevelopmentConfig


db = SQLAlchemy()


app = Flask(__name__, template_folder='templates')
load_dotenv()

app.config.from_object(DevelopmentConfig)

db.init_app(app)
app.config['db'] = db
migrate = Migrate(app, db)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
login_manager = LoginManager(app)
jwt = JWTManager(app)


metadata = MetaData()
metadata.reflect(bind=create_engine(app.config['SQLALCHEMY_DATABASE_URI']))

api = Api(app, version='1.0', title='Lexilink Restful API', doc='/docs')
from api.v1.views.auth import auth
from api.v1.views.student import std
from api.v1.views.main import main
from api.v1.views.mentors import mentor
api.add_namespace(auth)
api.add_namespace(std)
api.add_namespace(main)
api.add_namespace(mentor)

@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


# load user
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    print(jwt_data)
    if identity:
        if jwt_data['user_type'] == 'student':
            return storage.find_by("StudentModel", username=identity)
        elif jwt_data['user_type'] == 'mentor':
            return storage.find_by("MentorModel", username=identity)
    return None

# additional_claims

@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return {'identity': identity}


# jwt error handlers

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    return make_response(jsonify({
        'message': 'The token has expired',
        'error': 'token_expired'
    }), 401)

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return make_response(jsonify({
        'message': 'Signature verification failed',
        'error': 'invalid_token'
    }), 401)

@jwt.unauthorized_loader
def unauthorized_loader(error):
    return make_response(jsonify({
        'message': 'Request does not contain an access token',
        'error': 'authorization_required'
    }), 401)

@jwt.needs_fresh_token_loader
def needs_fresh_token_callback():
    return make_response(jsonify({
        'message': 'The token is not fresh',
        'error': 'fresh_token_required'
    }), 401)

@jwt.revoked_token_loader
def revoked_token_callback():
    return make_response(jsonify({
        'message': 'The token has been revoked',
        'error': 'token_revoked'
    }), 401)


