#!/usr/bin/env python3
""" Index """
from models import storage
from flask import jsonify, request, abort, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, current_user
from flask_restx import Resource, Namespace, fields
from api.v1.views.models import  auth_parser


std = Namespace('student', description='Student related operations')

student_mentor_model = std.model('StudentMentor', {
    'mentor': fields.String(),
    })

@std.route('/profile/', strict_slashes=False)
class Student(Resource):
    @jwt_required()
    @std.expect(auth_parser)
    def get(self):
        """ Retrieves a student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=current_user.username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        return make_response(jsonify(student.to_dict()), 200)

    @jwt_required()
    @std.expect(auth_parser)
    def put(self):
        """ Updates a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        data = request.get_json()
        student.update(**data)
        return make_response(jsonify(student.to_dict()), 200)

    @jwt_required()
    @std.expect(auth_parser)
    def delete(self):
        """ Deletes a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        student.delete()
        return make_response(jsonify({}), 200)


@std.route('/mentors/all/', strict_slashes=False)
class Mentors(Resource):
    @std.expect(auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all mentors of this student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        mentors = student.mentors
        return make_response(jsonify({"mentors": [mentor.to_dict() for mentor in mentors]}), 200)


    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a mentor to a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return make_response(jsonify({"error": "Mentor not found"}), 404)
        student.mentors.append(mentor)
        student.save()
        return make_response(jsonify({}), 200)


@std.route('/mentors/favorites/', strict_slashes=False)
class FavoriteMentors(Resource):
    @std.expect(auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all favorite mentors """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        mentors = student.favorite_mentors
        return make_response(jsonify({"mentors": [mentor.to_dict() for mentor in mentors]}), 200)

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a favorite mentor to a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return make_response(jsonify({"error": "Unauthorized"}), 401)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return make_response(jsonify({"error": "Not found"}), 404)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return make_response(jsonify({"error": "Mentor not found"}), 404)
        student.favorite_mentors.append(mentor)
        student.save()
        return make_response(jsonify({}), 200)



