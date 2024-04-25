#!/usr/bin/env python3
from flask import render_template
from flask_restx import Resource, Namespace

main = Namespace('main', description='Main routes')
@main.route('/', strict_slashes=False)
class Main(Resource):
    def get(self):
        return render_template('index.html')
