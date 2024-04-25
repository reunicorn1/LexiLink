#!/usr/bin/env python3
from flask import  (
        render_template,
        redirect,
        url_for,
        request,
        jsonify,
        abort,
        make_response,
)
from models import storage
from flask_login import login_user, logout_user, login_required
from flask_jwt_extended import (
        create_access_token,
        create_refresh_token,
        jwt_required,
        get_jwt_identity,
        get_jwt,
        current_user,
)
import requests
from flask_restx import Resource, Namespace, fields
from api.v1.app import login_manager
from api.v1.views.models import  auth_parser

auth = Namespace('auth', description='Authentication')


@login_manager.user_loader
def load_user(username):
    return storage.find_by("StudentModel", username=username)

student_model = auth.model('Student', {
    'email': fields.String(),
    'username': fields.String(),
    'password': fields.String(),
    'first_name': fields.String(),
    'last_name': fields.String(),
    'country': fields.String(),
    'nationality': fields.String(),
    'first_language': fields.String(),
    'other_languages': fields.String(),
    'profile_picture': fields.String(),
    'proficiency': fields.String(),
    })

login_model = auth.model('Login', {
    'username': fields.String(),
    'password': fields.String(),
    })

auth_model = auth.model('authorization', {
    "Authorization": fields.String()
    })



@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.expect(login_model)
    def post(self):
        # Perform user authentication and obtain JWT token
        error = None
        data = request.get_json()
        user = load_user(data.get('username'))

        if user and user.verify_password(data.get('password')):
            access_token = create_access_token(identity=user.username,
                    additional_claims={"user_type": "student"})
            refresh_token = create_refresh_token(identity=user.username,
                    additional_claims={"user_type": "student"})


            login_user(user)
            print(f'User {user.username} logged in')
            return make_response(jsonify(access_token=access_token,
                    refresh_token=refresh_token), 200)
        else:
            error = 'Invalid username or password. Please try again.'
        make_response(jsonify({'error': error}), 401)


@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.expect(student_model)
    def post(self):
        data = request.get_json()
        if data:
            if storage.find_by("StudentModel", email=data.get('email')):
                return make_response(jsonify({'error': 'User with this email already exists'}), 400)
            if storage.find_by("StudentModel", username=data.get('username')):
                return make_response(jsonify({'error': 'User with this username already exists'}), 400)

            storage.create("StudentModel", **data)
            return make_response(jsonify({'status': 'success'}), 200)
        return make_response(jsonify({'error': 'Invalid data'}), 400)


@auth.route('/logout', strict_slashes=False)
class Logout(Resource):
    @jwt_required()
    @auth.expect(auth_parser)
    def post(self):
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        if current_user:
            logout_user()
            return make_response(jsonify({'status': 'success'}), 200)
        return make_response(jsonify({'error': 'User not logged in'}), 401)



@auth.route('/profile', strict_slashes=False)
class Profile(Resource):
    @jwt_required()
    @auth.expect(auth_parser)
    def get(self):
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        if current_user:
            return make_response(jsonify(current_user.to_dict()), 200)
        return make_response(jsonify({'error': 'User not found'}), 404)

    @auth.expect(auth_parser, student_model)
    @jwt_required()
    def put(self):
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        if current_user:
            data = request.get_json()
            current_user.update(**data)
            return make_response(jsonify(current_user.to_dict()), 200)
        return make_response(jsonify({'error': 'User not found'}), 404)


@auth.route('/refresh', strict_slashes=False)
class Refresh(Resource):
    @jwt_required(refresh=True)
    @auth.expect(auth_parser)
    def post(self):
        access_token = create_access_token(identity=current_user.username)
        print(f'User {current_user.username} refreshed token')
        return make_response(jsonify(access_token=access_token), 200)
