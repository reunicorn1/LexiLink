#!/usr/bin/env python3
""" Module for Mentor related operations """
from flask import jsonify, request, make_response
from flask_jwt_extended import jwt_required
from flask_restx import Resource, Namespace, fields
from flask_jwt_extended import (
        jwt_required,
        get_jwt,
        current_user,
)
from models import storage
from api.v1.views.parsers import auth_parser, query_parser
from datetime import datetime, timedelta



sessions = Namespace('sessions', description='Session related operations')

class IntervalField(fields.Raw):
    """ Class for IntervalField
    Methods:   
        format(self, value): converts timedelta to dict

    Args:
        fields (_type_): _description_
    """
    def format(self, value):
        # Assuming 'value' is a datetime.timedelta object
        return {'days': value.days, 'seconds': value.seconds, 'microseconds': value.microseconds}

filter_model = sessions.model('Filter_Session', {
    'mentor': fields.String(description='Mentor ID'),
    'student': fields.String(description='Student ID'),
    'date': fields.DateTime(description='Date'),
    'time': fields.DateTime(description='Time'),
    'duration': fields.DateTime(description='Duration'),
    'status': fields.String(description='Status')
})

update_model = sessions.model('Update', {
    'session_id': fields.String(description='Session ID'),
    'mentor_id': fields.String(description='Mentor ID'),
    'student_id': fields.String(description='Student ID'),
    'date': fields.DateTime(description='Date'),
    'time': fields.DateTime(description='Time'),
    'duration': fields.DateTime(description='Duration'),
    'status': fields.String(description='Status')
})

session_model = sessions.model('Session', {
    'mentor': fields.String(description='Mentor ID'),
    'date': fields.DateTime(description='Date'),
    'time': fields.DateTime(description='Time'),
    'duration': fields.DateTime(description='Duration'),
    'status': fields.String(description='Status')
    })

session_payment_model = sessions.model('SessionPayment', {
    'mentor': fields.String(),
    'date': fields.DateTime(description='Date'),
    'time': fields.DateTime(description='Time'),
    'duration': fields.DateTime(description='Duration'),
    'status': fields.String(description='Status'),
    'amount': fields.Integer(description="Amount"),
    'method': fields.String(description="Method")
    })

@sessions.route('/', strict_slashes=False)
class Sessions(Resource):
    """ Class for session related operations """
    @jwt_required()
    @sessions.expect(auth_parser, query_parser)
    def get(self):
        """ Retrieves all sessions of user """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        page = request.args.get('page', 1)
        user = storage.find_by(cls=("MentorModel", "StudentModel")[claims['user_type'] == 'student'],
                               username=claims['identity'])
        sessions = user.sessions
        for session in sessions:
            print(session.to_dict())
        # print(sessions)
        if not sessions:
            return make_response(jsonify({"sessions": []}), 200)
        sessions_pagination = []
        i = (int(page) - 1) * 10
        for session in sessions:
            if i < int(page) * 10 and i >= (int(page) - 1) * 10:
                sessions_pagination.append(session.to_dict())
            i += 1
        return make_response(jsonify({"sessions": [session for session in sessions_pagination]}), 200)
    
    
    @jwt_required()
    @sessions.expect(auth_parser, session_payment_model)
    def post(self):
        """ Creates a session for a student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        data = request.get_json()
        
        student = storage.find_by("StudentModel", username=claims['identity'])
        mentor = storage.find_by("MentorModel", username=data['mentor'])
        if mentor is None:
            return make_response(jsonify({"error": "Mentor not found"}), 404)
        if student is None:
            return make_response(jsonify({"error": "Student not found"}), 404)
        data['mentor_id'] = mentor.id
        data['student_id'] = student.id
        data['date'] = datetime.fromisoformat(data['date']).date("Y-m-d")
        data['time'] = datetime.fromisoformat(data['time']).strftime("%H:%M:%S")
        data['duration'] = datetime.fromisoformat(data['duration']).strftime("%H:%M:%S")
        
        
        payment_data = {
            'student_id': data['student_id'],
            'mentor_id': data['mentor_id'],
            'date': data['date'],
            'time': data['time'],
            'duration': data['duration'],
            'status': 'Approved',
            'amount': data['amount'],
            'method': data['method']
        }
        session_data = {
            'mentor_id': data['mentor_id'],
            'student_id': data['student_id'],
            'date': data['date'],
            'time': data['time'],
            'duration': data['duration'],
            'status': 'Approved'
        }
        payment = storage.create("PaymentModel", **payment_data)
        payment.save()
        session = storage.create("SessionModel", **session_data)
        session.payment = payment
        session.save()
        student.sessions.append(session)
        mentor.sessions.append(session)
        mentor.save()
        student.save()
        return make_response(jsonify(session.to_dict()), 201)

    @jwt_required()
    @sessions.expect(auth_parser, update_model)
    def put(self):
        """ Updates a session """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        data = request.get_json()
        session = storage.find_by("SessionModel", id=data['session_id'])
        del data['session_id']
        session.update(**data)
        return make_response(jsonify(session.to_dict()), 200)
        

@sessions.route('/<string:session_id>', strict_slashes=False)
class Session(Resource):
    """ Class for session related operations """
    @jwt_required()
    @sessions.expect(auth_parser)
    def get(self, session_id):
        """ Retrieves a session """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        return make_response(jsonify(session.to_dict()), 200)

    @jwt_required()
    @sessions.expect(auth_parser, update_model)
    def put(self, session_id):
        """ Updates a session """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        data = request.get_json()
        session.update(**data)
        return make_response(jsonify(session.to_dict()), 200)

    @jwt_required()
    @sessions.expect(auth_parser)
    def delete(self, session_id):
        """ Deletes a session """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        session.delete()
        return make_response(jsonify({}), 200)
    
    
    
@sessions.route('/all', strict_slashes=False)
class SessionsAll(Resource):
    """ Class for session related operations """
    @sessions.expect(query_parser, filter_model)
    def post(self):
        """ Retrieves all sessions """
        page = request.args.get('page', default=1, type=int)
        kwargs = request.get_json()
        sessions_list = storage.query("SessionModel", **kwargs,
                                      page=page, per_page=10)
        if sessions_list is None:
            return make_response(jsonify({"sessions": []}), 200)
        print(sessions_list)
        return make_response(jsonify([session.to_dict() for session in sessions_list]), 200)
    
    @sessions.expect(query_parser)
    def get(self):
        """ Retrieves all sessions """
        page = request.args.get('page', default=1, type=int)
        sessions_list = storage.query("SessionModel", page=page, per_page=10)
        return make_response(jsonify([session.to_dict() for session in sessions_list]), 200)

