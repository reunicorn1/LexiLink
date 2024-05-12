#!/usr/bin/env python3
"""
Module for session related operations.
    Classes:
        Sessions(Resource): Class for multiple session related operations
                            Must be logged in as a student to create a session
        Session(Resource): Class for single session related operations
                            Must be logged in as a mentor or student to access
        SessionsAll(Resource): Class for session related operations
                            No login required
        Room(Resource): Class for session room token generation
                        Must be logged in as a mentor or student to access
        Status(Resource): Class for session status modification by mentor

"""
from datetime import datetime, timedelta
from os import getenv

from agora_token_builder import RtcTokenBuilder
from dotenv import load_dotenv
from flask import jsonify, make_response, request
from flask_jwt_extended import current_user, get_jwt, jwt_required
from flask_restx import Namespace, Resource, fields

from api.v1.views.parsers import auth_parser, query_parser
from models import storage
from api.v1.views.responses import Responses

sessions = Namespace('sessions', description='Session related operations')

respond = Responses()

load_dotenv()


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
    """ Class for session related operations
        Methods:
            Get: Retrieves all sessions of user
            Post: Creates a session for a student

    """
    @jwt_required()
    @sessions.expect(auth_parser, query_parser)
    def get(self):
        """ Retrieves all sessions of user
            Returns:
                Status code: 200 when successful, List of sessions
                Status code: 401 when unauthorized
                Status code: 404 when not found
        """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        page = request.args.get('page', 0)
        
        user = storage.find_by(cls=("MentorModel",
                                    "StudentModel")[claims['user_type'] == 'student'],
                                username=claims['identity'])
        user_sessions = user.sessions
        if not user_sessions:
            return respond.ok({"sessions": []})
        if page == 0:
            return respond.ok({"sessions": [session.to_dict() for session in user_sessions]})
        sessions_pagination = []
        i = (int(page) - 1) * 10
        for session in user_sessions:
            if (int(page) - 1) * 10 <= i < int(page) * 10:
                sessions_pagination.append(session.to_dict())
            i += 1
        return respond.ok({"sessions": sessions_pagination})


    @jwt_required()
    @sessions.expect(auth_parser, session_payment_model)
    def post(self):
        """ Creates a session for a student
            Returns:
                Status code: 201 when successful, Session data
                Status code: 401 when unauthorized
                Status code: 404 when not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        data = request.get_json()
        student = storage.find_by("StudentModel", username=claims['identity'])
        mentor = storage.find_by("MentorModel", username=data['mentor'])
        if mentor is None:
            return respond.not_found({"error": "Mentor not found"})
        if student is None:
            return respond.not_found({"error": "Student not found"})
        data['mentor_id'] = mentor.id
        data['student_id'] = student.id
        data['date'] = datetime.fromisoformat(data['date']).date()
        data['time'] = datetime.fromisoformat(data['time']).strftime("%H:%M:%S")
        data['duration'] = datetime.fromisoformat(data['duration']).strftime("%H:%M:%S")


        payment_data = {
            'student_id': data['student_id'],
            'mentor_id': data['mentor_id'],
            'date': data['date'],
            'time': data['time'],
            'duration': data['duration'],
            'status': 'Pending',  # 'Approved', 'Declined', 'Pending'
            'amount': data['amount'],
            'method': data['method']
        }
        session_data = {
            'mentor_id': data['mentor_id'],
            'student_id': data['student_id'],
            'date': data['date'],
            'time': data['time'],
            'duration': data['duration'],
            'status': 'Pending',  # 'Approved', 'Declined', 'Pending'
        }
        # Create payment and session objects
        payment = storage.create("PaymentModel", **payment_data)
        payment.save()
        session = storage.create("SessionModel", **session_data)
        # add payment to session
        session.payment = payment
        session.save()
        # add session to student and mentor
        student.sessions.append(session)
        if mentor not in student.mentors:
            # add mentor to student
            student.mentors.append(mentor)
        mentor.sessions.append(session)
        mentor.save()
        student.save()
        return respond.created({"session": session.to_dict()})

    @jwt_required()
    @sessions.expect(auth_parser, update_model)
    def put(self):
        """ Updates a session """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        data = request.get_json()
        session = storage.find_by("SessionModel", id=data['session_id'])
        del data['session_id']
        session.update(**data)
        return respond.ok({
            "session": session.to_dict()})


@sessions.route('/<string:session_id>', strict_slashes=False)
class Session(Resource):
    """ Class for session related operations
        Methods:
            Get: Retrieves a session, must be logged in as a mentor or student
            Put: Updates a session, must be logged in as a mentor or student
            Delete: Deletes a session, must be logged in as a mentor or student
    """
    @jwt_required()
    @sessions.expect(auth_parser)
    def get(self, session_id):
        """ Retrieves a session
            Returns:
                Status code: 200 when successful, Session data
                Status code: 401 when unauthorized
                Status code: 404 when not found
        """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
        return respond.ok({"session": session.to_dict()})

    @jwt_required()
    @sessions.expect(auth_parser, update_model)
    def put(self, session_id):
        """ Updates a session
            Returns:
                Status code: 200 when successful, Session data
                Status code: 401 when unauthorized
                Status code: 404 when not found
        """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
        data = request.get_json()
        if "date" in data:
            data['date'] = datetime.fromisoformat(data['date']).date()
        if "time" in data:
            data['time'] = datetime.fromisoformat(data['time']).strftime("%H:%M:%S")
        if "duration" in data:
            data['duration'] = datetime.fromisoformat(data['duration']).strftime("%H:%M:%S")
        session.update(**data)
        return respond.ok({"session": session.to_dict()})

    @jwt_required()
    @sessions.expect(auth_parser)
    def delete(self, session_id):
        """ Deletes a session
            Returns:
                Status code: 200 when successful, Success message
                Status code: 401 when unauthorized
                Status code: 404 when not found
        """
        claims = get_jwt()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
        session.delete()
        return respond.ok({"message": "Session deleted successfully"})


@sessions.route('/all', strict_slashes=False)
class SessionsAll(Resource):
    """ Class for session related operations
        Methods:
            Post: Retrieves all sessions based on query
            Get: Retrieves all sessions
    """
    @sessions.expect(query_parser, filter_model)
    def post(self):
        """ Retrieves all sessions
            Returns:
                Status code: 200 when successful, List of sessions
                Status code: 404 when not found
        """
        page = request.args.get('page', default=1, type=int)
        kwargs = request.get_json()
        sessions_list = storage.query("SessionModel", **kwargs,
                                        page=page, per_page=10)
        if sessions_list is None:
            return respond.ok({"sessions": []})
        return respond.ok({
            "sessions": [session.to_dict() for session in sessions_list]})

    @sessions.expect(query_parser)
    def get(self):
        """ Retrieves all sessions
            Returns:
                Status code: 200 when successful, List of sessions
        """
        page = request.args.get('page', default=1, type=int)
        sessions_list = storage.query("SessionModel", page=page, per_page=10)
        return respond.ok({
            "sessions": [session.to_dict() for session in sessions_list]})


@sessions.route('/room/<string:session_id>', strict_slashes=False)
class Room(Resource):
    """ Class for session room token generation
        Methods:
            Get: Retrieves the agora token, user ID and channel name
            for a session
                Returns:
                    Status code: 200 when successful,
                                    Token, user ID and channel name
                    Status code: 401 when unauthorized
                    Status code: 404 when not found
                    Status code: 400 when bad request
    """
    @jwt_required()
    @sessions.expect(auth_parser)
    def get(self, session_id):
        """ Get the agora token for a session
            Returns:
                Status code: 200 when successful,
                                Token, user ID and channel name
                Status code: 401 when unauthorized
                Status code: 404 when not found
                Status code: 400 when bad request
        """
        claims = get_jwt()
        date = datetime.now().date()
        if claims['user_type'] not in ['mentor', 'student']:
            return respond.unauthorized("Unauthorized")
        user = claims['user_type'] == 'student'
        try:
            if claims['user_type'] == 'mentor':
                mentor = storage.find_by("MentorModel",
                                            username=claims['identity'])
                session = storage.find_by("SessionModel",
                                            mentor_id=mentor.id, id=session_id)
                student = storage.find_by("StudentModel",
                                            id=session.student_id)
                user_id = mentor.id
            else:
                student = storage.find_by("StudentModel",
                                            username=claims['identity'])
                session = storage.find_by("SessionModel",
                                            student_id=student.id,
                                            id=session_id)
                mentor = storage.find_by("MentorModel",
                                            id=session.mentor_id)
                user_id = student.id
            if not mentor or not student or not session:
                return respond.not_found(f"Not found")
        except Exception as e:
            return respond.bad_request({"error": str(e)})
        if session.date.date() < date:
            return respond.bad_request({"error": "Session has passed"})
        if session.status != 'Approved':
            return respond.bad_request({"error": "Session is not approved"})
        # session.mentor_token = None
        # session.student_token = None
        # session.save()
        channelName = session_id[:8] + student.id[:8] + mentor.id[:8]
        token = (session.mentor_token, session.student_token)[user]
        if token is not None:
            return respond.ok({"token": token, "uid": user_id,
                                "channel": channelName})
        # generate room ID using session ID and student ID and mentor ID
        appId = getenv('AGORA_APPID')
        appCertificate = getenv('AGORA_CERTIFICATE')
        account = user_id
        role = 1
        start_time = datetime.combine(session.date, session.time)
        start_time = start_time + timedelta(hours=12)
        print("start_time", start_time)
        expire_time = start_time + timedelta(hours=session.duration.hour,
                                    minutes=session.duration.minute)
        print("expire_time", expire_time)
        privilegeExpiredTs = int(expire_time.timestamp())
        token = RtcTokenBuilder.buildTokenWithAccount(appId,
                    appCertificate, channelName,
                    account, role, privilegeExpiredTs)
        if user:
            session.student_token = token
        else:
            session.mentor_token = token
        session.save()
        return respond.ok({
                            "token": token,
                            "uid": user_id,
                            "channel": channelName})




@sessions.route('/status/<string:session_id>', strict_slashes=False)
class Status(Resource):
    """ Class to update session status for mentors
        Methods:
            Put: Updates a session status, must be logged in as a mentor
    """
    @jwt_required()
    @sessions.expect(auth_parser)
    def put(self, session_id):
        """ Updates a session status """
        claims = get_jwt()
        data = request.get_json()
        if not data or 'status' not in data:
            return respond.bad_request({"error": "Missing status"})
        if claims['user_type'] != 'mentor':
            return respond.unauthorized("Unauthorized")
        session = storage.find_by("SessionModel", id=session_id)
        if session is None:
            return respond.not_found("Not found")
        session.status = data['status']
        session.save()
        return respond.ok({
            "session": session.to_dict()})
