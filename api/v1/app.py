#!/usr/bin/env python3
"""_
This module creates the Flask app and initializes the extensions
and database.

"""
from flask import Flask, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
from sqlalchemy import create_engine, MetaData
from flask_restx import Api
from flask_migrate import Migrate
from models import storage
from api.v1.extensions import login_manager
from api.v1.views.auth import auth
from api.v1.views.student import std
from api.v1.views.mentors import mentor
from api.v1.views.sessions import sessions
from api.v1.jwt_manager import JWTManagerWrapper
from api.v1.config import DevelopmentConfig

MY_PREFIX = '/api'

class ReverseProxied(object):
    '''Wrap the application in this middleware and configure the
    front-end server to add these headers, to let you quietly bind
    this to a URL other than / and to an HTTP scheme that is
    different than what is used locally.

    :param app: the WSGI application
    '''
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        path_info = environ['PATH_INFO']

        # Check if the request path already starts with /api
        environ['SCRIPT_NAME'] = MY_PREFIX
        path_info = path_info[len(MY_PREFIX):]

        environ['PATH_INFO'] = path_info
        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)



def create_app(CONFIG=DevelopmentConfig):
    """
    This function creates the Flask app and initializes the extensions
    and database.
    create_app: This function creates the Flask app and initializes the
                extensions and database.
                It returns the app instance.

Properties:
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

Methods:

        close_db: This function closes the database connection.
                    Serves as a teardown function.
        not_found: This function handles the 404 error.



Returns:
    app: The Flask app instance with the extensions and database initialized.
    """

    db = SQLAlchemy()
    migration = Migrate()
    cors = CORS()
    metadata = MetaData()

    # api = Api(version='1.0', prefix='/api', title='Lexilink Restful API', doc='/docs')
    api = Api(version='1.0', title='Lexilink Restful API', doc='/docs')



    app = Flask(__name__, template_folder='templates')
    app.config.from_object(CONFIG)
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
    app.wsgi_app = ReverseProxied(app.wsgi_app)


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
