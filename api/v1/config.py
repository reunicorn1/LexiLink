#!/usr/bin/env python3
"""
This module defines the configuration settings for the Flask app.
"""
from decouple import config
from models import storage
from datetime import timedelta


class Config:
    """
    This class defines the configuration settings for the Flask app.
    Properties:
        SECRET_KEY: The secret key for the Flask app.
        SQLALCHEMY_TRACK_MODIFICATIONS: A boolean that indicates whether
                                        modifications to database objects should
                                        be tracked.
        JWT_BLACKLIST_ENABLED: A boolean that indicates whether the blacklist
                               feature of the Flask-JWT-Extended extension is
                               enabled.
        JWT_BLACKLIST_TOKEN_CHECKS: A list of strings that indicate the types of
                                    tokens that should be checked against the
                                    blacklist.
        PROPAGATE_EXCEPTIONS: A boolean that indicates whether exceptions should
                             be propagated.
        SQLALCHEMY_ECHO: A boolean that indicates whether SQL statements should
                        be printed to the terminal.
        MAIL_SERVER: The SMTP server for sending emails.
        MAIL_PORT: The port for the SMTP server.
        MAIL_USE_SSL: A boolean that indicates whether SSL should be used for
                      the SMTP server.
        MAIL_USERNAME: The username for the SMTP server.
        MAIL_PASSWORD: The password for the SMTP server.
    """
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS',
                                            cast=bool)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    PROPAGATE_EXCEPTIONS = True
    SQLALCHEMY_ECHO = True
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = config('MAIL_USERNAME')
    MAIL_PASSWORD = config('MAIL_PASSWORD')




class DevelopmentConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    development mode.
    Properties:
        DEBUG: A boolean that indicates whether the app is in debug mode.
        SQLALCHEMY_DATABASE_URI: The URI for the database.
        JWT_ACCESS_TOKEN_EXPIRES: The expiration time for the access token.
        JWT_REFRESH_TOKEN_EXPIRES: The expiration time for the refresh token.
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=12)

class TokenTestConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    development mode.
    Properties:
        DEBUG: A boolean that indicates whether the app is in debug mode.
        SQLALCHEMY_DATABASE_URI: The URI for the database.
        JWT_ACCESS_TOKEN_EXPIRES: The expiration time for the access token.
        JWT_REFRESH_TOKEN_EXPIRES: The expiration time for the refresh token.
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=2)

class ProductionConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    production mode.
    Properties:
        DEBUG: A boolean that indicates whether the app is in debug mode.
        SQLALCHEMY_DATABASE_URI: The URI for the database.
        JWT_ACCESS_TOKEN_EXPIRES: The expiration time for the access token.
        JWT_REFRESH_TOKEN_EXPIRES: The expiration time for the refresh token.
    """
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class TestingConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    testing mode.
    Properties:
        TESTING: A boolean that indicates whether the app is in testing mode.
        DEBUG: A boolean that indicates whether the app is in debug mode.
        SQLALCHEMY_DATABASE_URI: The URI for the database.
        JWT_ACCESS_TOKEN_EXPIRES: The expiration time for the access token.
        JWT_REFRESH_TOKEN_EXPIRES: The expiration time for the refresh token.
    """
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=5)


