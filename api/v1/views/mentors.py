#!/usr/bin/env python3
""" Module for Mentor related operations
    Classes:
        MentorById(Resource): Retrieves a mentor by id
        Mentor(Resource): Mentor related operations
        Mentors(Resource): Retrieves all mentors
        Students(Resource): Mentor's Students related operations
        Sessions(Resource): retrieves all sessions of a mentor sorted by date desc
        Filter(Resource): retrieves all mentors filtered by languages
        SessionsById(Resource): retrieves a session by id
        
"""
from flask import request, current_app
from flask_jwt_extended import current_user, get_jwt, jwt_required
from flask_restx import Namespace, Resource, fields
from flask_login import logout_user
from api.v1.views.parsers import auth_parser, query_parser
from api.v1.views.responses import Responses
from models import storage
from api.v1.views.email_util import send_email
from models.SessionModel import SessionModel

# Create a namespace object
mentor = Namespace('mentor', description='Mentor related operations')
# Create a responses object
respond = Responses()

# Define the availability model for the user model
availability_model = mentor.model('Availability', {
    'days': fields.List(fields.String, description='Days available'),
    'startTime': fields.String(description='Start time of availability'),
    'endTime': fields.String(description='End time of availability'),
})

# Define the filter model for the mentor model
filter_model = mentor.model('Filter', {
    'first_language': fields.String(description='First Language'),
    'other_languages': fields.List(fields.String, description='Other Languages'),
    'availability': fields.Nested(availability_model, description='Availability'),
    'price_per_hour': fields.Integer(description='Price per hour'),
    'type': fields.String(description='Type')
})

# Define the language model for the mentor model
language_model = mentor.model('Language', {
    'languages': fields.List(fields.String, description='Language'),
    'type': fields.String(description='Type'),
    'min_price': fields.Integer(description='Price per hour'),
    'max_price': fields.Integer(description='Price per hour')
})

# Define the mentor_student model for the mentor model
mentor_student_model = mentor.model('MentorStudent', {
    'student': fields.String(),
    })


@mentor.route('/<string:id>/', strict_slashes=False)
class MentorById(Resource):
    """
    This class retrieves a mentor by id
    methods: GET - Retrieves a mentor by id
                    Returns a mentor otherwise a 404 error
    """

    def get(self, id):
        """ Retrieves a mentor """
        user = storage.find_by("MentorModel", id=id)
        if user is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        return respond.ok({"mentor": user.to_dict()})


@mentor.route('/profile/', strict_slashes=False)
class Mentor(Resource):
    """
    Mentor related operations
    methods:
        GET - Retrieves a mentor
        PUT - Updates a mentor
        DELETE - Deletes a mentor
    """
    @jwt_required()
    @mentor.expect(auth_parser)
    def get(self):
        """ Retrieves a mentor
            If not mentor, returns unauthorized 401 error
            Returns a mentor otherwise a 404 error if not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        user = current_user
        if user is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        return respond.ok({"profile": user.to_dict()})

    @jwt_required()
    @mentor.expect(auth_parser)
    def put(self):
        """ Updates a mentor
            If not mentor, returns unauthorized 401 error
            Returns a mentor otherwise a 404 error if not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        user = current_user
        if user is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        data = request.get_json()
        user.update(**data)
        current_app.logger.info(f"User {user.id} updated")
        return respond.ok({"profile": user.to_dict()})

    @jwt_required()
    @mentor.expect(auth_parser)
    def delete(self):
        """ Deletes a mentor 
            If not mentor, returns unauthorized 401 error
            Returns a 404 error if not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        user = current_user
        if user is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        if current_user:
            refresh_token = request.get_json().get('refresh_token')
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
            current_app.logger.info(f"User {user.id} deleted")
            user.delete()
            return respond.ok({'status': 'success', 'message': 'Mentor deleted successfully'})
        except Exception as e:
            return respond.internal_server_error(str(e),
                                                 self.__class__.__name__,
                                                 current_app.logger)



@mentor.route('/all/', strict_slashes=False)
class Mentors(Resource):
    """
    Retrieves all mentors
    methods: 
            GET - Retrieves all mentors
            POST - Retrieves all mentors based on query parameters
    """

    @mentor.expect(query_parser, filter_model)
    def post(self):
        """ Retrieves all mentors based on query parameters
            Returns a 404 error if not found
            Returns a list of mentors otherwise
        """
        page = request.args.get('page', default=1, type=int)
        kwargs = request.get_json()
        mentors = storage.query(cls="MentorModel", **kwargs,
                                page=page, per_page=10)
        if not mentors:
            return respond.ok({"mentors": []})
        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})

    @mentor.expect(query_parser)
    def get(self):
        """ Retrieves all mentors
            Returns a 404 error if not found
            Returns a list of mentors otherwise
        """
        page = request.args.get('page', default=1, type=int)
        mentors = storage.query(cls="MentorModel",
                                page=page, per_page=10)
        if mentors is None:
            respond.ok({"mentors": []})
        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})


@mentor.route('/students/', strict_slashes=False)
class Students(Resource):
    """
    Mentor's Students related operations
    methods:
        GET - Retrieves all students of this mentor
        POST - Adds a student to this mentor
    """
    @mentor.expect(auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all students of this mentor 
            If not mentor, returns unauthorized 401 error
            Returns a 404 error if not found
            Returns a list of students otherwise
        """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        students = current_user.students
        if students is None:
            return respond.ok({"students": []})
        return respond.ok({"students": [student.to_dict()
                                        for student in students]})

    @mentor.expect(auth_parser, mentor_student_model)
    @jwt_required()
    def post(self):
        """ Adds a student to this mentor
            If not mentor, returns unauthorized 401 error
            Returns a 404 error if not found
            Returns a success message otherwise
        """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        data = request.get_json()
        user = current_user
        student = storage.find_by("StudentModel", username=data.get('student'))
        if student is None:
            return respond.not_found("Student not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        user.students.append(student)
        user.save()
        return respond.ok({"message": "Student added successfully"})

@mentor.route('/sessions/<string:mentor_id>', strict_slashes=False)
class Sessions(Resource):
    """ retrieves all sessions of a mentor sorted by date desc 
        methods:
            GET - Retrieves all sessions of a mentor sorted by date desc
    """
    def get(self, mentor_id):
        """ Retrieves all sessions of a mentor sorted by date desc
            Returns a 404 error if not found
            Returns a list of sessions otherwise
        """
        user = storage.find_by("MentorModel", id=mentor_id)
        if user is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        sessions = user.sessions.order_by(SessionModel.date.desc()).all()
        if sessions is None:
            return respond.ok({"sessions": []})
        return respond.ok({"sessions": [session.to_dict()
                                        for session in sessions]})


@mentor.route('/sessions/<string:session_id>', strict_slashes=False)
class SessionsById(Resource):
    """
    retrieves a session by id
    methods:
        GET - Retrieves a session by id
        POST - Adds a session to a mentor
    """

    def get(self, session_id):
        """ Retrieves a session
            Returns a 404 error if not found
            Returns a session otherwise
        """
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.ok({"session": {}})
        return respond.ok({"session": session.to_dict()})
    
    @jwt_required()
    @mentor.expect(auth_parser)
    def post(self, session_id):
        """ adds a session to a mentor
            If not mentor, returns unauthorized 401 error
            Returns a 404 error if not found
            Returns a list of sessions otherwise
        """
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        if current_user and session and session not in current_user.sessions:
            current_user.sessions.append(session)
        sessions = current_user.sessions.order_by(SessionModel.date.desc()).all()
        current_user.save()
        return respond.ok({"sessions": [session.to_dict()
                                                    for session in sessions]})


@mentor.route('/filter/', strict_slashes=False)
class Filter(Resource):
    """ retrieves all mentors filtered by languages
        each mentor has 2 language related attributes:
        first_language (string) and other_languages (list)
        check if languages are in the first_language or other_languages
        
        Methods:
            POST - Retrieves all mentors filtered by languages
    """

    @mentor.expect(language_model)
    def post(self):
        """ Retrieves all mentors
            format:
            {
                "languages": [str],
                "min_price": int,
                "max_price": int
            }
            Returns a 404 error if not found
            Returns a list of mentors otherwise
        """
        mentors = set()
        data = request.get_json()
        # get the languages from the data
        languages = data.pop('languages', None)
        # convert the min_price and max_price to integers
        if 'min_price' in data:
            data['min_price'] = int(data['min_price'])
        if 'max_price' in data:
            data['max_price'] = int(data['max_price'])
        # query all mentors
        mentors_query = storage.query_all(cls="MentorModel", **data)
        #  if no languages, return all mentors found
        if not languages:
            return respond.ok({"mentors": [user.to_dict()
                                            for user in mentors_query]})
        # check if languages are in the first_language or other_languages
        for user in mentors_query:
            # combine the first_language and other_languages
            langs = [user.first_language] + list(user.other_languages)
            # check if the languages are in the langs
            if set(languages).issubset(langs):
                mentors.add(user)
        
        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})


@mentor.route('/email_student/', strict_slashes=False)
class EmailStudent(Resource):
    """
    Email a student
    methods:
        POST - Email a student
    """
    def post(self):
        """
        Send an email to a student
        """
        data = request.get_json()
        sender = storage.find_by("MentorModel", email=data.get('sender'))
        receiver = storage.find_by("StudentModel", email=data.get('receiver'))
        response = send_email(sender, receiver, data.get('subject'), data.get('message'))
        if response.status_code != 202:
            return respond.internal_server_error(response.body,
                                                 self.__class__.__name__,
                                                 current_app.logger)
        return respond.ok(response)