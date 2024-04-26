#!/usr/bin/env python3
from flask import (
        request,
        jsonify,
        make_response,
)
from flask_login import login_user, logout_user
from flask_jwt_extended import (
        create_access_token,
        create_refresh_token,
        jwt_required,
        get_jwt,
        current_user,
)
from flask_restx import Resource, Namespace, fields
from models import storage
from api.v1.extensions import login_manager
from api.v1.views.parsers import auth_parser

auth = Namespace('auth', description='Authentication')

user_model = auth.model('UserModel', {
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
    'expertise': fields.String(),
    'price_per_hour': fields.Integer(),
    'availability': fields.String(),
    'type': fields.String(),
    'bio': fields.String(),
    'demo_video': fields.String(),
    'proficiency': fields.String(),
    'user_type': fields.String(),
    })


login_model = auth.model('Login', {
    'email': fields.String(),
    'password': fields.String(),
    'user_type': fields.String()
    })

auth_model = auth.model('authorization', {
    "Authorization": fields.String()
    })

verify_email_model = auth.model('VerifyEmail', {
    'email': fields.String(),
    'user_type': fields.String()
    })

verify_username_model = auth.model('VerifyEmail', {
    'username': fields.String(),
    'user_type': fields.String()
    })


@login_manager.user_loader
def load_user(email, user_type=None):
    """ load user from database """
    if user_type == 'mentor':
        return storage.find_by("MentorModel", email=email)
    return storage.find_by("StudentModel", email=email)


@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.expect(login_model)
    def post(self):
        """ Perform user authentication and obtain JWT token """
        error = None
        data = request.get_json()
        user_type = data.get('user_type')
        if not data or user_type not in ['student', 'mentor']:
            return make_response(jsonify({'error': 'Invalid request data'}),
                                 402)
        user = load_user(data.get('email'), user_type=user_type)
        if user and user.verify_password(data.get('password')):
            access_token = create_access_token(identity=user.username,
                                               additional_claims={
                                                   "user_type":
                                                   user_type})
            refresh_token = create_refresh_token(
                                                 identity=user.username,
                                                 additional_claims={
                                                     "user_type":
                                                     user_type})

            if data.get('remember'):
                login_user(user, remember=True)
            else:
                login_user(user)
            print(f'User {user.username} logged in')
            return make_response(jsonify(access_token=access_token,
                                         refresh_token=refresh_token), 200)
        else:
            error = 'Invalid email or password. Please try again.'
        return make_response(jsonify({'error': error}), 401)


@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.expect(user_model)
    def post(self):
        """ Register a new user """
        data = request.get_json()
        user_type = data.get('user_type')
        if not data or not user_type:
            return make_response(jsonify({'error': 'Invalid request data'}),
                                 402)
        if user_type == 'mentor':
            model = "MentorModel"
        elif user_type == 'student':
            model = "StudentModel"
        else:
            return make_response(jsonify({'error': 'Invalid user type'}), 400)
        if storage.find_by(model, email=data.get('email')):
            return make_response(
                                 jsonify(
                                     {'error':
                                      'User with this email already exists'}),
                                 400)
        if storage.find_by(model, username=data.get('username')):
            return make_response(jsonify(
                {'error': 'User with this username already exists'}), 401)

        storage.create(model, **data)
        return make_response(jsonify({'status': 'success'}), 200)


@auth.route('/logout', strict_slashes=False)
class Logout(Resource):
    @jwt_required(verify_type=False)
    @auth.expect(auth_parser)
    def delete(self):
        """ Logs out a user """
        claims = get_jwt()
        if (claims['user_type'] != 'student' and
                claims['user_type'] != 'mentor'):
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        if current_user:
            logout_user()
            storage.create("BlockListModel",
                           jwt=claims['jti'],
                           type=claims['type'])
            return make_response(jsonify(
                {'status': 'success', 'message': 'User logged out'}), 200)
        return make_response(jsonify({'error': 'User not logged in'}), 401)


@auth.route('/refresh', strict_slashes=False)
class Refresh(Resource):
    @jwt_required(refresh=True)
    @auth.expect(auth_parser)
    def post(self):
        """ Refreshes a user's token """
        user_type = get_jwt()['user_type']

        if user_type == 'student':
            access_token = create_access_token(identity=current_user.username,
                                               additional_claims={
                                                   "user_type": "student"})
        elif user_type == 'mentor':
            access_token = create_access_token(identity=current_user.username,
                                               additional_claims={
                                                   "user_type": "mentor"})
        else:
            return make_response(jsonify({'error': 'Invalid user'}), 401)
        print(f'User {current_user.username} refreshed token')
        return make_response(jsonify(access_token=access_token), 200)


@auth.route('/verify_email', strict_slashes=False)
class Verify(Resource):
    @auth.expect(verify_email_model)
    def post(self):
        """ Verify if email exists """
        data = request.get_json()
        user = load_user(data.get('email'), data.get('user_type'))
        if user:
            return make_response(jsonify(
                {'error': 'email already exists'}), 400)
        return make_response(jsonify({'status': 'success'}), 200)


@auth.route('/verify_username', strict_slashes=False)
class VerifyUsername(Resource):
    @auth.expect(verify_username_model)
    def post(self):
        """ Verify if username exists """
        data = request.get_json()
        if data.get('user_type') == 'mentor':
            user = storage.find_by("MentorModel",
                                   username=data.get('username'))
        elif data.get('user_type') == 'student':
            user = storage.find_by("StudentModel",
                                   username=data.get('username'))
        else:
            return make_response(jsonify({'error': 'Invalid user type'}), 400)
        if user:
            return make_response(jsonify({'error': 'username already exists'}),
                                 400)
        return make_response(jsonify({'status': 'success'}), 200)
