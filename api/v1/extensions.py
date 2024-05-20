#!/usr/bin/env python3
"""
This module defines the tools and extensions for the Flask app.
These tools and extensions include the database, migration, CORS, API,
JWTManager, and logging.
"""
from os import getenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import create_engine, MetaData
from flask_restx import Api
from flask_migrate import Migrate
from api.v1.jwt_manager import JWTManagerWrapper
from api.v1.namespaces import add_namespaces
from api.v1.logging import apply_logging
from api.v1.reverse_proxy import ReverseProxied
from api.v1.login_manager import login_manager



def setup_tools_and_extensions(app, CONFIG):
    """
    This function sets up the tools and extensions for the Flask app.
    setup_tools_and_extensions: This function sets up the tools and extensions
                                for the Flask app.
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
    Parameters:
        app (Flask): The Flask app.
        CONFIG (object): The configuration object.
    Returns:
        app: The Flask app with the tools and extensions set up.
    """
    # set the app configuration
    app.config.from_object(CONFIG)
    app.url_map.strict_slashes = False

    # initialize the tools and extensions
    db = SQLAlchemy()
    migration = Migrate()
    cors = CORS()
    metadata = MetaData()

    # create the api instance
    api = Api(version='1.0', title='Lexilink Restful API', doc='/docs')
    # add the database to the app
    db.init_app(app)
    # add the migration to the app
    migration.init_app(app, db)
    # add the CORS to the app
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    # add the login manager to the app
    login_manager.init_app(app)

    # apply logging to the app

    if getenv("LEXILINK_MYSQL_ENV") != "test":
        apply_logging(app)

    # create the JWT manager
    jwt_wrapper = JWTManagerWrapper()
    jwt_wrapper.init_app(app)

    # bind the metadata to the engine
    metadata.reflect(bind=create_engine(app.config['SQLALCHEMY_DATABASE_URI']))

    # add the api to the app
    api.init_app(app)

    # add namespaces to the api
    add_namespaces(app, api)

    # add the reverse proxy
    app.wsgi_app = ReverseProxied(app.wsgi_app)

    return app
