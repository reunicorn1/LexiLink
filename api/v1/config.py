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
    """
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS',
                                            cast=bool)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    PROPAGATE_EXCEPTIONS = True
    SQLALCHEMY_ECHO = True



class DevelopmentConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    development mode.
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=12)

class TokenTestConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    development mode.
    """
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=2)

class ProductionConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    production mode.
    """
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class TestingConfig(Config):
    """
    This class defines the configuration settings for the Flask app in
    testing mode.
    """
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = storage.get_uri()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=5)
