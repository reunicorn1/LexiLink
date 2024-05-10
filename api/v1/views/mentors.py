#!/usr/bin/env python3
""" Module for Mentor related operations """
from flask import jsonify, make_response, request
from flask_jwt_extended import current_user, get_jwt, jwt_required
from flask_restx import Namespace, Resource, fields

from api.v1.views.parsers import auth_parser, query_parser
from api.v1.views.responses import Responses
from models import storage
from models.SessionModel import SessionModel

mentor = Namespace('mentor', description='Mentor related operations')
respond = Responses()

availability_model = mentor.model('Availability', {
    'days': fields.List(fields.String, description='Days available'),
    'startTime': fields.String(description='Start time of availability'),
    'endTime': fields.String(description='End time of availability'),
})

filter_model = mentor.model('Filter', {
    # 'expertise': fields.String(description='Expertise'),
    # availability is a json object
    'first_language': fields.String(description='First Language'),
    'other_languages': fields.List(fields.String, description='Other Languages'),
    'availability': fields.Nested(availability_model, description='Availability'),
    'price_per_hour': fields.Integer(description='Price per hour'),
    'type': fields.String(description='Type')
})

language_model = mentor.model('Language', {
    'languages': fields.List(fields.String, description='Language'),
    'type': fields.String(description='Type'),
    'min_price': fields.Integer(description='Price per hour'),
    'max_price': fields.Integer(description='Price per hour')
})

mentor_student_model = mentor.model('MentorStudent', {
    'student': fields.String(),
    })


@mentor.route('/<string:id>/', strict_slashes=False)
class MentorById(Resource):
    """
    retrieves a mentor by id
    method: GET
    """

    def get(self, id):
        """ Retrieves a mentor """
        user = storage.find_by("MentorModel", id=id)
        if user is None:
            return respond.not_found("Not found")
        return respond.ok(user.to_dict())


@mentor.route('/profile/', strict_slashes=False)
class Mentor(Resource):
    """
    Mentor related operations
    methods: GET, PUT, DELETE
    """
    @jwt_required()
    @mentor.expect(auth_parser)
    def get(self):
        """ Retrieves a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        user = current_user
        if user is None:
            return respond.not_found("Not found")
        return respond.ok({"mentor": user.to_dict()})

    @jwt_required()
    @mentor.expect(auth_parser)
    def put(self):
        """ Updates a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        user = current_user
        if user is None:
            return respond.not_found("Not found")
        data = request.get_json()
        user.update(**data)
        return respond.ok({"mentor": user.to_dict()})

    @jwt_required()
    @mentor.expect(auth_parser)
    def delete(self):
        """ Deletes a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        user = current_user
        if user is None:
            return respond.not_found("Not found")
        user.delete()
        return respond.ok({"message": "Mentor deleted successfully"})


@mentor.route('/all/', strict_slashes=False)
class Mentors(Resource):

    @mentor.expect(query_parser, filter_model)
    def post(self):
        """ Retrieves all mentors """
        page = request.args.get('page', default=1, type=int)
        kwargs = request.get_json()
        mentors = storage.query(cls="MentorModel", **kwargs,
                                page=page, per_page=10)
        if mentors is None:
            return respond.not_found("Not found")
        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})

    @mentor.expect(query_parser)
    def get(self):
        """ Retrieves all mentors """
        page = request.args.get('page', default=1, type=int)
        mentors = storage.query(cls="MentorModel",
                                page=page, per_page=10)
        if mentors is None:
            return respond.not_found("Not found")
        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})


@mentor.route('/students/', strict_slashes=False)
class Students(Resource):
    """
    Mentor's Students related operations
    methods: GET, POST
    """
    @mentor.expect(query_parser, auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all students of this mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        students = current_user.students
        if students is None:
            return respond.not_found("Student not found")
        return respond.ok({"students":[student.to_dict()
                                        for student in students]})

    @mentor.expect(auth_parser, mentor_student_model)
    @jwt_required()
    def post(self):
        """ Adds a student to this mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        data = request.get_json()
        user = current_user
        student = storage.find_by("StudentModel", username=data.get('student'))
        if student is None:
            return respond.not_found("Student not found")
        user.students.append(student)
        user.save()
        return respond.ok({"message": "Student added successfully"})

@mentor.route('/sessions/<string:mentor_id>', strict_slashes=False)
class Sessions(Resource):
    """ retrieves all sessions of a mentor sorted by date desc """
    def get(self, mentor_id):
        """ Retrieves all sessions """
        user = storage.find_by("MentorModel", id=mentor_id)
        if user is None:
            return respond.not_found("Not found")
        sessions = user.sessions.order_by(SessionModel.date.desc()).all()
        if sessions is None:
            return respond.not_found("No sessions found")
        return respond.ok({"sessions": [session.to_dict()
                                                    for session in sessions]})


@mentor.route('/sessions/<string:session_id>', strict_slashes=False)
class SessionsById(Resource):

    def get(self, session_id):
        """ Retrieves a session """
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
        return respond.ok({"session": session.to_dict()})
    
    @jwt_required()
    @mentor.expect(auth_parser)
    def post(self, session_id):
        """ adds a session to a mentor """
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
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
    """

    @mentor.expect(language_model)
    def post(self):
        """ Retrieves all mentors """
        mentors = set()
        data = request.get_json()
        languages = data.pop('languages', None)
        if 'min_price' in data:
            data['min_price'] = int(data['min_price'])
        if 'max_price' in data:
            data['max_price'] = int(data['max_price'])

        mentors_query = storage.query_all(cls="MentorModel", **data)
        if not languages:
            return respond.ok({"mentors": [user.to_dict()
                                            for user in mentors_query]})
        for user in mentors_query:
            langs = [user.first_language] + list(user.other_languages)
            if set(languages).issubset(langs):
                mentors.add(user)

        return respond.ok({"mentors": [user.to_dict()
                                        for user in mentors]})

