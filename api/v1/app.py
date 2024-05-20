#!/usr/bin/env python3
"""_
This module creates the Flask app and initializes the extensions
and database.

"""
from flask import Flask, jsonify, make_response
from models import storage
from api.v1.extensions import setup_tools_and_extensions
from api.v1.config import DevelopmentConfig
from api.v1.views.responses import Responses


def create_app(CONFIG=DevelopmentConfig):
    """
    This function creates the Flask app and initializes the extensions
    and database.
    create_app: This function creates the Flask app and initializes the
                extensions and database.
                It returns the app instance.
    Methods:
        close_db: This function closes the database connection.
                    Serves as a teardown function.
        not_found: This function handles the 404 error.

    Returns:
        app: The Flask app instance with the extensions
                and database initialized.
    """

    # create the app instance and
    # setup the app tools and extensions
    app = setup_tools_and_extensions(Flask(__name__,
                                           template_folder='templates'),
                                     CONFIG)
    respond = Responses()

    @app.route('/status', methods=['GET'])
    def status():
        """ app status
        ---
        responses:
            200:
        accessed by a GET request to /status
        """
        return respond.ok({'status': 'OK'})

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
        return respond.not_found("Not found", None)

    return app
