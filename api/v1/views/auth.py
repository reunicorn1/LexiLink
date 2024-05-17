#!/usr/bin/env python3
"""
The authentication module for the Flask app.
Manages user authentication and JWT token creation.

        Classes:
            Login(Resource): Defines the login route for the Flask app.
            Signup(Resource): Defines the signup route for the Flask app.
            Logout(Resource): Defines the logout route for the Flask app.
            Refresh(Resource): Defines the refresh route for the Flask app.
            VerifyUsername(Resource): Defines the verify username
                                        route for the Flask app.
            VerifyEmail(Resource): Defines the verify email
                                        route for the Flask app.

"""
from flask import (
        request,
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
from api.v1.views.parsers import auth_parser
from api.v1.views.responses import Responses
from api.v1.extensions import load_user, clean_data

# Create a namespace object
auth = Namespace('auth', description='Authentication')
# Create a responses object
respond = Responses()

# Define the availability model for the user model
availability_model = auth.model('Availability', {
    'days': fields.List(fields.String, description='Days available'),
    'startTime': fields.String(description='Start time of availability'),
    'endTime': fields.String(description='End time of availability'),
})

# Define the user model for the authentication routes
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
    'availability': fields.Nested(availability_model, description='Availability'),
    'type': fields.String(),
    'bio': fields.String(),
    'demo_video': fields.String(),
    'proficiency': fields.String(),
    'user_type': fields.String(),
    })

# Define the login model for the authentication routes
login_model = auth.model('Login', {
    'email': fields.String(),
    'password': fields.String(),
    'user_type': fields.String()
    })

# Define the authorization model for the authentication routes
auth_model = auth.model('authorization', {
    "Authorization": fields.String()
    })

# Define the verify email model for the authentication routes
verify_email_model = auth.model('VerifyEmail', {
    'email': fields.String(),
    'user_type': fields.String()
    })

# Define the verify username model for the authentication routes
verify_username_model = auth.model('VerifyEmail', {
    'username': fields.String(),
    'user_type': fields.String()
    })

logout_model = auth.model('Logout', {
    'refresh_token': fields.String(),
    })



def get_user_model(user_type):
    """ Get user model based on user type """
    return ("MentorModel", "StudentModel")[user_type == 'student']

def invalid_user(user_type):
    """ Check user type validity """
    return not user_type or user_type not in ['student', 'mentor']

@auth.route('/login', strict_slashes=False)
class Login(Resource):
    """
    This class defines the login route for the Flask app.
    method: POST - Perform user authentication and obtain JWT token,
                    return unauthorized if invalid email or password.
                    otherwise return the JWT token and login the user.

    """
    @auth.expect(login_model)
    def post(self):
        """ Perform user authentication and obtain JWT token """
        data = clean_data(request.get_json())
        if not data:
            return respond.invalid_data('Invalid request data')
        if invalid_user(data.get('user_type')):
            return respond.invalid_data('Invalid user type')
        user_type = data.pop('user_type')
        user = load_user(data.get('email'), user_type=user_type)
        if user and user.verify_password(data.get('password')):
            access_token = create_access_token(identity=user.username,
                                               additional_claims={
                                                   "user_type":
                                                   user_type})
            print("Length of access token: ", len(access_token))
            refresh_token = create_refresh_token(
                                                 identity=user.username,
                                                 additional_claims={
                                                     "user_type":
                                                     user_type})
            print("Length of refresh token: ", len(refresh_token))
            if data.get('remember'):
                login_user(user, remember=True)
            else:
                login_user(user)
            print(f'User {user.username} logged in')
            return respond.ok({'access_token': access_token,
                            'refresh_token': refresh_token})

        return respond.unauthorized(
                        'Invalid email or password. Please try again.')


@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    """
    This class defines the signup route for the Flask app.
    method: POST - Register a new user, return forbidden if user already exists.
                otherwise create the user and return success.
    """
    @auth.expect(user_model)
    def post(self):
        """ Register a new user """
        data = clean_data(request.get_json())
        if not data:
            return respond.invalid_data('Invalid request data')
        user_type = data.pop('user_type')
        if invalid_user(user_type):
            return respond.invalid_data('Invalid user type')
        model = get_user_model(user_type)
        if storage.find_by(model, email=data.get('email')):
            return respond.forbidden('User with this email already exists')
        if storage.find_by(model, username=data.get('username')):
            return respond.forbidden('User with this username already exists')
        storage.create(model, **data)
        return respond.created({'status': 'success'})


@auth.route('/logout', strict_slashes=False)
class Logout(Resource):
    """
    This class defines the logout route for the Flask app.
    method: DELETE - Logs out a user, return unauthorized if user not logged in.
                    otherwise log out the user and return success.

    """
    @jwt_required(verify_type=False)
    @auth.expect(auth_parser, logout_model)
    def delete(self):
        """ Logs out a user """
        claims = get_jwt()
        if invalid_user(claims['user_type']):
            return respond.invalid_data('Invalid user type')
        if current_user:
            refresh_token = clean_data(request.get_json()).get('refresh_token')
            if not refresh_token:
                return respond.unauthorized('User not logged in')
            logout_user()
            try:
                storage.create("BlockListModel",
                                jwt=claims['jti'],
                                type=claims['type'])
                storage.create("BlockListModel",
                                jwt=refresh_token,
                                type="refresh")
                return respond.ok({'status': 'success', 'message': 'User logged out'})
            except Exception as e:
                return respond.internal_server_error(str(e))
        return respond.unauthorized('User not logged in')


@auth.route('/refresh', strict_slashes=False)
class Refresh(Resource):
    """
    This class defines the refresh route for the Flask app.
    method: GET - Refreshes a user's token, return unauthorized if invalid user type.
                    otherwise refresh the user's token and return the new token.
    """
    @jwt_required(refresh=True)
    @auth.expect(auth_parser)
    def get(self):
        """ Refreshes a user's token """
        user_type = get_jwt()['user_type']

        if invalid_user(user_type):
            return respond.invalid_data('Invalid user type')

        access_token = create_access_token(identity=current_user.username,
                                            additional_claims={
                                            "user_type": user_type
                                            })
        print(f'User {current_user.username} refreshed token')
        return respond.ok({"access_token": access_token})


@auth.route('/verify_email', strict_slashes=False)
class VerifyEmail(Resource):
    """
    This class defines the verify email route for the Flask app.
    method: POST - Verify if email exists, return forbidden if email already exists.
                    otherwise return success.
    """
    @auth.expect(verify_email_model)
    def post(self):
        """ Verify if email exists """
        data = clean_data(request.get_json())
        if not data or invalid_user(data.get('user_type')):
            return respond.invalid_data('Invalid request data')
        if not data.get('email') or not data.get('user_type'):
            return respond.invalid_data('Invalid request data')
        user = load_user(data.get('email'), data.get('user_type'))
        if user:
            return respond.forbidden('Email already exists')
        return respond.ok({'status': 'Success'})


@auth.route('/verify_username', strict_slashes=False)
class VerifyUsername(Resource):
    """
    This class defines the verify username route for the Flask app.
    method: POST - Verify if username exists, return forbidden if username already exists.
                    otherwise return success.
    """
    @auth.expect(verify_username_model)
    def post(self):
        """ Verify if username exists """
        data = clean_data(request.get_json())
        if (not data
                or not data.get('username')
                or not data.get('user_type')
                or invalid_user(data.get('user_type'))):
            return respond.invalid_data('Invalid request data')
        user = storage.find_by(get_user_model(data.get('user_type')),
                               username=data.get('username'))
        if user:
            return respond.forbidden('Username already exists')
        return respond.ok({'status': 'Success'})
