#!/usr/bin/env python3
"""
This module defines the logging for the Flask app.
"""
import logging
from logging.handlers import RotatingFileHandler


def apply_logging(app):
    """
    This function applies logging to the app instance.
    apply_logging: This function applies logging to the app instance.
                    It returns the app instance.
    Properties:
        stream: The stream handler for logging.
        file_handler: The file handler for logging.
        app: The Flask app instance.

    Args:
        app (Flask app): The Flask app instance.

    Returns:
        app: The Flask app instance with logging applied.
    """
    # # file_handler = logging.FileHandler('app.log')
    # stream = logging.StreamHandler()
    # stream.setLevel(logging.DEBUG)
    # logging.basicConfig(filename='app.log', level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    # # file_handler.setLevel(logging.DEBUG)
    # # file_handler.setFormatter(logging.Formatter(
    # #     '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    # # file_handler.mode = 'a'
    # # app.logger.addHandler(file_handler)
    # app.logger.addHandler(stream)
    # app.logger.info('App started')
     # Set up file handler
    file_handler = RotatingFileHandler('app.log')
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))

    # Set up stream handler (stdout)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    stream_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))

    # Add handlers to app's logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(stream_handler)
    # werkzeug_logger = logging.getLogger('werkzeug')
    # werkzeug_logger.addHandler(file_handler)
    return app