#!/usr/bin/env python3
"""
This module defines the responses for the Flask app.
It includes the responses for the following:
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error
"""
from flask import jsonify, make_response


class Responses:
    """
    This class defines the responses for the Flask app.
    methods:
        ok(data): This function returns a 200 OK response.
        created(data): This function returns a 201 Created response.
        no_content(): This function returns a 204 No Content response.
        bad_request(error): This function returns a 400 Bad Request response.
        unauthorized(error): This function returns a 401 Unauthorized response.
        forbidden(error): This function returns a 403 Forbidden response.
        not_found(error): This function returns a 404 Not Found response.
        conflict(error): This function returns a 409 Conflict response.
        internal_server_error(error): This function returns a 500 Internal Server Error response.
    """

    def ok(self, data):
        """
        This function returns a 200 OK response.
        """
        return make_response(jsonify(data), 200)

    def created(self, data):
        """
        This function returns a 201 Created response.
        """
        return make_response(jsonify(data), 201)

    def no_content(self):
        """
        This function returns a 204 No Content response.
        """
        return make_response('', 204)

    def bad_request(self, error):
        """
        This function returns a 400 Bad Request response.
        """
        return make_response(jsonify({'error': error}), 400)

    def unauthorized(self, error):
        """
        This function returns a 401 Unauthorized response.
        """
        return make_response(jsonify({'error': error}), 401)

    def invalid_data(self, error):
        """
        This function returns a 402 Invalid Data response.
        """
        return make_response(jsonify({'error': error}), 402)

    def forbidden(self, error):
        """
        This function returns a 403 Forbidden response.
        """
        return make_response(jsonify({'error': error}), 403)

    def not_found(self, error):
        """
        This function returns a 404 Not Found response.
        """
        return make_response(jsonify({'error': error}), 404)

    def conflict(self, error):
        """
        This function returns a 409 Conflict response.
        """
        return make_response(jsonify({'error': error}), 409)

    def internal_server_error(self, error):
        """
        This function returns a 500 Internal Server Error response.
        """
        return make_response(jsonify({'error': error}), 500)