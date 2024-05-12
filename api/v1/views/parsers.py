#!/usr/bin/env python3
"""
This module defines the parsers for the API endpoints.
"""
from flask_restx import reqparse
from flask.globals import session

# auth_parser is used to parse the Authorization header in the request.
# format should be 'Bearer {token}'
auth_parser = reqparse.RequestParser()
auth_parser.add_argument('Authorization', location='headers', required=True)

# query_parser is used to parse the query string in the request.
query_parser = reqparse.RequestParser()
query_parser.add_argument('page', type=int, required=False,
                            default=1, help='Page number')

