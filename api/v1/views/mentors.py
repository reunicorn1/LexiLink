#!/usr/bin/env python3
""" Index """
from models import storage
from flask import jsonify, request, abort, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, Namespace, fields
from api.v1.views.models import  auth_parser
from api.v1.app import login_manager
from flask_jwt_extended import (
        create_access_token,
        create_refresh_token,
        jwt_required,
        get_jwt_identity,
        get_jwt,
        current_user,
)
from flask_login import login_user, logout_user
mentor = Namespace('mentor', description='Mentor related operations')


from api.v1.views.models import  auth_parser, query_parser


@login_manager.user_loader
def load_user(username):
    return storage.find_by("MentorModel", username=username)


mentor_model = mentor.model('Mentor', {
    'username': fields.String(),
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
    })


filter_model = mentor.model('Filter', {
    'expertise': fields.String(description='Expertise'),
    'availability': fields.String(description='Availability'),
    'price_per_hour': fields.Integer(description='Price per hour'),
    'type': fields.String(description='Type')
})
login_model = mentor.model('Login', {
    'username': fields.String(),
    'password': fields.String(),
    })

mentor_student_model = mentor.model('MentorStudent', {
    'student': fields.String(),
    })

@mentor.route('/login/', strict_slashes=False)
class MentorLogin(Resource):
    @mentor.expect(login_model)
    def post(self):
        """ Logs in a mentor """
        data = request.get_json()
        mentor = load_user(data['username'])

        if mentor and mentor.verify_password(data['password']):
            access_token = create_access_token(identity=mentor.username,
                    additional_claims={"user_type": "mentor"})
            refresh_token = create_refresh_token(identity=mentor.username,
                    additional_claims={"user_type": "mentor"})
            login_user(mentor)
            print(f"User {mentor.username} logged in")
            return make_response(jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token
            }), 200)
        else:
            error = "Invalid username or password. Please try again."
        make_response(jsonify({"error": error}), 401)



@mentor.route('/logout/', strict_slashes=False)
class MentorLogout(Resource):
    @jwt_required()
    @mentor.expect(auth_parser)
    def post(self):
        """ Logs out a mentor """
        claims = get_jwt()

        if claims and claims['user_type'] == 'mentor':
            logout_user()
            return make_response(jsonify({'status': 'success'}), 200)
        return make_response(jsonify({'error': 'User not logged in'}), 401)

@mentor.route('/signup/', strict_slashes=False)
class MentorSignup(Resource):
    @mentor.expect(mentor_model)
    def post(self):
        """ Signs up a mentor """
        data = request.get_json()
        if data:
            if storage.find_by("MentorModel", username=data.get('username')):
                return make_response(jsonify({'error': 'User with this username already exists'}), 400)
            if storage.find_by("MentorModel", username=data.get('username')):
                return make_response(jsonify({'error': 'User with this username already exists'}), 400)

            storage.create("MentorModel", **data)
            return make_response(jsonify({'status': 'success'}), 200)
        return make_response(jsonify({'error': 'Invalid data'}), 400)



@mentor.route('/profile/', strict_slashes=False)
class Mentor(Resource):
    @jwt_required()
    @mentor.expect(auth_parser)
    def get(self):
        """ Retrieves a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        mentor = storage.find_by("MentorModel", username=current_user.username)
        if mentor is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        return make_response(jsonify(mentor.to_dict()), 200)

    @jwt_required()
    @mentor.expect(auth_parser)
    def put(self):
        """ Updates a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        mentor = storage.find_by("MentorModel", username=current_user.usernam)
        if mentor is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        data = request.get_json()
        mentor.update(**data)
        return make_response(jsonify(mentor.to_dict()), 200)

    @jwt_required()
    @mentor.expect(auth_parser)
    def delete(self):
        """ Deletes a mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        mentor = storage.find_by("MentorModel", username=current_user.username)
        if mentor is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        mentor.delete()
        return make_response(jsonify({}), 200)


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
            return make_response(jsonify({"error": "Not found"}), 404)
        return make_response(jsonify({"mentors": [mentor.to_dict() for mentor in mentors]}), 200)

    @mentor.expect(query_parser)
    def get(self):
        """ Retrieves all mentors """
        page = request.args.get('page', default=1, type=int)
        mentors = storage.query(cls="MentorModel",
                page=page, per_page=10)
        if mentors is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        return make_response(jsonify({"mentors": [mentor.to_dict() for mentor in mentors]}), 200)


@mentor.route('/students/', strict_slashes=False)
class Students(Resource):
    @mentor.expect(query_parser, auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all students of this mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        # get mentor by username
        students = current_user.students
        if students is None:
            return make_response(jsonify({"error": "No Students for this mentor"}), 404)
        return make_response(jsonify([student.to_dict() for student in students]), 200)

    @mentor.expect(auth_parser, mentor_student_model)
    @jwt_required()
    def post(self):
        """ Adds a student to this mentor """
        claims = get_jwt()
        if claims['user_type'] != 'mentor':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=current_user.username)
        student = storage.find_by("StudentModel", username=data.get('student'))
        if mentor is None:
            return make_response(jsonify({"error": "Mentor not found"}), 404)
        if student is None:
            return make_response(jsonify({"error": "Student not found"}), 404)
        mentor.students.append(student)
        mentor.save()
        return make_response(jsonify({"status": "success"}), 200)
