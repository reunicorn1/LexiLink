#!/usr/bin/env python3
"""
This module defines the JWT manager for the Flask app.
"""
from datetime import timedelta

from flask import jsonify, make_response
from flask_jwt_extended import JWTManager

from models import storage


class JWTManagerWrapper:
    """
    This class wraps the JWT manager for the Flask app.
    """
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        """
        This method initializes the JWT manager for the Flask app.
        """
        self.jwt = JWTManager(app)


        @self.jwt.user_lookup_loader
        def user_lookup_callback(_jwt_header, jwt_data):
            """
            This function is called when a protected route is accessed. It
            should return the identity of the user from the token. If the
            token is invalid, this function should return None.
            """
            identity = jwt_data["sub"]
            if identity:
                if jwt_data['user_type'] == 'student':
                    return storage.find_by("StudentModel", username=identity)
                elif jwt_data['user_type'] == 'mentor':
                    return storage.find_by("MentorModel", username=identity)
            return None

        @self.jwt.additional_claims_loader
        def add_claims_to_access_token(identity):
            """
            This function is called when creating an access token. It should
            return a dictionary with any claims to be added to the access token.
            """
            return {'identity': identity}

        @self.jwt.expired_token_loader
        def expired_token_callback(jwt_header, jwt_data):
            """
            This function is called when an expired token is received. It should
            return a response to be sent to the client.
            """
            print("expired_token_callback")
            response = make_response(jsonify({
                'message': 'The token has expired',
                'error': 'token_expired'
                }), 410)
            response.headers['Content-Type'] = 'application/json'
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
            response.headers['Netlify-CDN-Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
            return response

        @self.jwt.invalid_token_loader
        def invalid_token_callback(error):
            """
            This function is called when an invalid token is received. It should
            return a response to be sent to the client.
            """
            response =  make_response(jsonify({
                'message': 'Signature verification failed',
                'error': 'invalid_token'
                }), 411)
            response.headers['Content-Type'] = 'application/json'
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
            response.headers['Netlify-CDN-Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
            return response

        @self.jwt.unauthorized_loader
        def unauthorized_loader(error):
            """
            This function is called when an unauthorized token is received. It
            should return a response to be sent to the client.
            """
            return make_response(jsonify({
                'message': 'Request does not contain an access token',
                'error': 'authorization_required'
                }), 412)

        @self.jwt.needs_fresh_token_loader
        def needs_fresh_token_callback():
            """
            This function is called when a fresh token is required. It should
            return a response to be sent to the client.
            """
            return make_response(jsonify({
                'message': 'The token is not fresh',
                'error': 'fresh_token_required'
                }), 413)

        @self.jwt.revoked_token_loader
        def revoked_token_callback(jwt_header, jwt_data):
            """
            This function is called when a revoked token is received. It should
            return a response to be sent to the client.
            """
            return make_response(jsonify({
                'message': 'The token has been revoked',
                'error': 'token_revoked'
                }), 444)

        @self.jwt.token_in_blocklist_loader
        def check_if_token_in_blocklist(jwt_header, jwt_data):
            """
            This function is called to check if a token is in the blocklist.
            It should return True if the token has been revoked, and False
            otherwise.
            """
            return storage.find_by("BlockListModel",
                    jwt=jwt_data['jti']) is not None

