#!/usr/bin/env python3
"""_
This module creates the Flask app and initializes the extensions
and database.


Args:
    app (Flask app): The Flask app instance. Managed by the create_app
                    function and api using flask_restx.
    db (SQLAlchemy): The SQLAlchemy instance. Managed by the create_app
                    function.
    migration (Migrate): The Migrate instance. Managed by the create_app
                    function.
    cors (CORS): The CORS instance. Managed by the create_app function.
    jwt (JWTManager): The JWTManager instance. Managed by the create_app
                    function.
    metadata (MetaData): The MetaData instance. Managed by the create_app


Returns:
    app: The Flask app instance with the extensions and database initialized.
"""
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
from api.v1.views import auth
from api.v1.views import student as std
from api.v1.views import mentor
from api.v1.views import sessions
from api.v1.jwt_manager import JWTManagerWrapper
from datetime import timedelta



db = SQLAlchemy()
migration = Migrate()
cors = CORS()
metadata = MetaData()

api = Api(version='1.0', title='Lexilink Restful API', doc='/docs')


def create_app():
    """
    This function creates the Flask app and initializes the extensions
    and database.

    """


    app = Flask(__name__, template_folder='templates')
    app.config.from_object(DevelopmentConfig)
    load_dotenv()
    db.init_app(app)
    migration.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    login_manager.init_app(app)

    jwt_wrapper = JWTManagerWrapper()
    jwt_wrapper.init_app(app)


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


    return app
