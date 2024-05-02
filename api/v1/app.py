#!/usr/bin/env python3
from flask import Flask, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from sqlalchemy import create_engine, MetaData
from flask_restx import Api
from flask_migrate import Migrate
from models import storage, db
from api.v1.config import DevelopmentConfig
from api.v1.extensions import login_manager
from api.v1.views.auth import auth
from api.v1.views.student import std
from api.v1.views.mentors import mentor
from api.v1.views.sessions import sessions



db = SQLAlchemy()
migration = Migrate()
cors = CORS()
jwt = JWTManager()
metadata = MetaData()

api = Api(version='1.0', title='Lexilink Restful API', doc='/docs')


def create_app():
    """ Create Flask app """
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(DevelopmentConfig)
    load_dotenv()
    db.init_app(app)
    migration.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    login_manager.init_app(app)
    jwt.init_app(app)
    metadata.reflect(bind=create_engine(app.config['SQLALCHEMY_DATABASE_URI']))
    api.init_app(app)
    api.add_namespace(auth)
    api.add_namespace(std)
    api.add_namespace(mentor)
    api.add_namespace(sessions)


    @app.teardown_appcontext
    def close_db(error):
        """ Close Storage """
        if error:
            storage.rollback()
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

    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        return {'identity': identity}

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        print(jwt_data)
        return make_response(jsonify({
            'message': 'The token has expired',
            'error': 'token_expired'
        }), 410)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return make_response(jsonify({
            'message': 'Signature verification failed',
            'error': 'invalid_token'
        }), 411)

    @jwt.unauthorized_loader
    def unauthorized_loader(error):
        return make_response(jsonify({
            'message': 'Request does not contain an access token',
            'error': 'authorization_required'
        }), 412)

    @jwt.needs_fresh_token_loader
    def needs_fresh_token_callback():
        return make_response(jsonify({
            'message': 'The token is not fresh',
            'error': 'fresh_token_required'
        }), 413)

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_data):
        return make_response(jsonify({
            'message': 'The token has been revoked',
            'error': 'token_revoked'
        }), 444)

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_data):
        return storage.find_by("BlockListModel",
                               jwt=jwt_data['jti']) is not None

    return app
