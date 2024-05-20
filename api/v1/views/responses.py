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
from alembic.util.messaging import status

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
        
    @staticmethod
    def response_headers(response):
        """
        This function sets the response headers.
        """
        response.headers['Content-Type'] = 'application/json'
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
        response.headers['Netlify-CDN-Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
        return response

    def ok(self, data):
        """
        This function returns a 200 OK response.
        """
        response = make_response(jsonify(data), 200)
        return self.response_headers(response)

    def created(self, data):
        """
        This function returns a 201 Created response.
        """
        response = make_response(jsonify(data), 201)
        return self.response_headers(response)
    
    def no_content(self):
        """
        This function returns a 204 No Content response.
        """
        response = make_response('', 204)
        return self.response_headers(response)

    def bad_request(self, error, class_name, logger=None):
        """
        This function returns a 400 Bad Request response.
        """
        response = make_response(jsonify({'error': error}), 400)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def unauthorized(self, error, class_name, logger=None):
        """
        This function returns a 401 Unauthorized response.
        """
        response = make_response(jsonify({'error': error}), 401)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def invalid_data(self, error, class_name, logger=None):
        """
        This function returns a 402 Invalid Data response.
        """
        response = make_response(jsonify({'error': error}), 402)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def forbidden(self, error, class_name, logger=None):
        """
        This function returns a 403 Forbidden response.
        """
        response = make_response(jsonify({'error': error}), 403)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def not_found(self, error, class_name, logger=None):
        """
        This function returns a 404 Not Found response.
        """
        response = make_response(jsonify({'error': error}), 404)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def conflict(self, error, class_name, logger=None):
        """
        This function returns a 409 Conflict response.
        """
        response = make_response(jsonify({'error': error}), 409)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)

    def internal_server_error(self, error, class_name, logger=None):
        """
        This function returns a 500 Internal Server Error response.
        """
        response = make_response(jsonify({'error': error}), 500)
        if logger:
            logger.error(f'Error: {response.status_code}\n{class_name}: {error}')
        return self.response_headers(response)
