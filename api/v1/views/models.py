#!/usr/bin/env python3
from flask_restx import fields, reqparse

#format should be 'Bearer {token}'
auth_parser = reqparse.RequestParser()
auth_parser.add_argument('Authorization', location='headers', required=True)


query_parser = reqparse.RequestParser()
query_parser.add_argument('page', type=int, required=False, default=1, help='Page number')


