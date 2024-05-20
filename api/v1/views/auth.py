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
from os import getenv
from flask import (
        request,
        redirect,
        current_app
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
from api.v1.login_manager import load_user
from api.v1.utils import clean_data
from api.v1.views.email_util import send_verification_email, s
from itsdangerous import SignatureExpired, BadSignature
from operator import is_

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
            return respond.invalid_data('Invalid request data',
                                        self.__class__.__name__,
                                        current_app.logger)
        if invalid_user(data.get('user_type')):
            return respond.invalid_data('Invalid user type',
                                        self.__class__.__name__,
                                        current_app.logger)
        user_type = data.pop('user_type')
        user = load_user(data.get('email'), user_type=user_type)
        if user and not user.is_verified:
            send_verification_email(data.get('email'),
                                    "%s %s" % (user.first_name, user.last_name),
                                    user_type=user_type)
            return respond.forbidden('Please verify your email before logging in',
                                     self.__class__.__name__,
                                     current_app.logger)
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
            # if data.get('remember'):
            #     login_user(user, remember=True)
            # else:
            login_user(user)
            current_app.logger.info(f'User {user.username} logged in')
            return respond.ok({'access_token': access_token,
                            'refresh_token': refresh_token})

        return respond.unauthorized(
                        'Invalid email or password. Please try again.',
                        self.__class__.__name__,
                        current_app.logger)


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
            return respond.invalid_data('Invalid request data',
                                        self.__class__.__name__,
                                        current_app.logger)
        user_type = data.pop('user_type')
        if invalid_user(user_type):
            return respond.invalid_data('Invalid user type',
                                        self.__class__.__name__,
                                        current_app.logger)
        model = get_user_model(user_type)
        if storage.find_by(model, email=data.get('email')):
            return respond.forbidden('User with this email already exists',
                                     self.__class__.__name__,
                                     current_app.logger)
        if storage.find_by(model, username=data.get('username')):
            return respond.forbidden('User with this username already exists',
                                     self.__class__.__name__,
                                     current_app.logger)
        storage.create(model, **data)
        current_app.logger.info("User %s created", data.get('username'))
        is_verified = data.get('is_verified') or False
        if getenv("LEXILINK_MYSQL_ENV") != "test" and not is_verified:
            send_verification_email(data.get('email'),
                                    "%s %s" % (data.get('first_name'),
                                               data.get('last_name')),
                                    user_type=user_type)
            current_app.logger.info("Verification email sent to %s",
                                    data.get('email'))
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
            return respond.invalid_data('Invalid user type',
                                        self.__class__.__name__,
                                        current_app.logger)
        if current_user:
            refresh_token = clean_data(request.get_json()).get('refresh_token')
            if not refresh_token:
                return respond.unauthorized('User not logged in',
                                            self.__class__.__name__,
                                            current_app.logger)
            logout_user()
            try:
                storage.create("BlockListModel",
                                jwt=claims['jti'],
                                type=claims['type'])
                storage.create("BlockListModel",
                                jwt=refresh_token,
                                type="refresh")
                current_app.logger.info('User %s logged out', claims['identity'])
                return respond.ok({'status': 'success', 'message': 'User logged out'})
            except Exception as e:
                return respond.internal_server_error(str(e),
                                                     self.__class__.__name__,
                                                     current_app.logger)
        return respond.unauthorized('User not logged in',
                                    self.__class__.__name__,
                                    current_app.logger)


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
            return respond.invalid_data('Invalid user type',
                                        self.__class__.__name__,
                                        current_app.logger)

        access_token = create_access_token(identity=current_user.username,
                                            additional_claims={
                                            "user_type": user_type
                                            })
        current_app.logger.info(f'User {current_user.username} refreshed token')
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
            return respond.invalid_data('Invalid request data',
                                        self.__class__.__name__,
                                        current_app.logger)
        if not data.get('email') or not data.get('user_type'):
            return respond.invalid_data('Invalid request data',
                                        self.__class__.__name__,
                                        current_app.logger)
        user = load_user(data.get('email'), data.get('user_type'))
        if user:
            return respond.forbidden('Email already exists',
                                     self.__class__.__name__,
                                     current_app.logger)
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
            return respond.invalid_data('Invalid request data',
                                        self.__class__.__name__,
                                        current_app.logger)
        user = storage.find_by(get_user_model(data.get('user_type')),
                               username=data.get('username'))
        if user:
            return respond.forbidden('Username already exists',
                                     self.__class__.__name__,
                                     current_app.logger)
        return respond.ok({'status': 'Success'})


@auth.route('/auth_confirm_email/<token>', strict_slashes=False)
class ConfirmEmail(Resource):
    """
    This class defines the confirm email route for the Flask app.
    method: GET - Confirm email, return forbidden if email already confirmed.
                    otherwise return success.
    """
    def get(self, token):
        """ Confirm email """
        try:
            email = s.loads(token, salt='email-confirm')
            user_type = request.args.get('user_type')
            if invalid_user(user_type):
                return respond.invalid_data('Invalid user type',
                                            self.__class__.__name__,
                                            current_app.logger)
        except SignatureExpired:
            return respond.forbidden('The token is expired',
                                     self.__class__.__name__,
                                     current_app.logger)
        except BadSignature:
            return respond.forbidden('The token is invalid',
                                     self.__class__.__name__,
                                     current_app.logger)
        user = load_user(email, user_type=user_type)
        user.is_verified = True
        user.save()
        frontend = getenv('APP_URL')
        if user_type == 'mentor':
            return redirect(f'{frontend}/mentor/sign-in')
        return redirect(f'{frontend}/sign-in')
