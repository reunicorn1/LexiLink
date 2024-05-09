#!/usr/bin/env python3
""" Module for Student related operations """
from flask import jsonify, request, make_response, send_file
from flask_jwt_extended import (
        jwt_required,
        get_jwt_identity,
        get_jwt,
        current_user
)
from flask_restx import Resource, Namespace, fields
from models import storage
from api.v1.views.parsers import auth_parser
from api.v1.views.responses import Responses

std = Namespace('student', description='Student related operations')

respond = Responses()


student_mentor_model = std.model('StudentMentor', {
    'mentor': fields.String(),
    })

# profile_picture_field = std.parser()
# profile_picture_field.add_argument('profile_picture', location='files', type='file')
# profile_picture_field.add_argument('Authorization', location='headers', required=True)



student_model = std.model('Student', {
    'email': fields.String(),
    'username': fields.String(),
    'password': fields.String(),
    'first_name': fields.String(),
    'last_name': fields.String(),
    'country': fields.String(),
    'nationality': fields.String(),
    'first_language': fields.String(),
    'other_languages': fields.String(),
    'profile_picture': fields.Raw(description='Profile Picture'),
    'proficiency': fields.String(),
    })


@std.route('/profile', strict_slashes=False)
class Profile(Resource):
    """"" Profile related operations """
    @jwt_required()
    @std.expect(auth_parser)
    def get(self):
        """ Retrieves a user's profile data """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        if current_user:
            return respond.ok(current_user.to_dict())
        return respond.not_found("User not found")

    @std.expect(auth_parser, student_model)
    @jwt_required()
    def put(self):
        """ Updates a user's profile data """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        if current_user:
            data = request.get_json()
            current_user.update(**data)
            return respond.ok(current_user.to_dict())
        return respond.not_found('User not found')

    @jwt_required()
    @std.expect(auth_parser)
    def delete(self):
        """ Deletes a student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel",
                                  username=current_user.username)
        if student is None:
            return respond.not_found("Not found")
        student.delete()
        return respond.ok({"message": "Student deleted successfully"})



# get student by id

@std.route('/<id>', strict_slashes=False)
class Student(Resource):
    def get(self, id):
        """ Retrieves a student """
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found")
        return respond.ok(student.to_dict())

    @std.expect(auth_parser, student_model)
    @jwt_required()
    def put(self, id):
        """ Updates a student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found")
        data = request.get_json()
        student.update(**data)
        return respond.ok(student.to_dict())

    @std.expect(auth_parser)
    @jwt_required()
    def delete(self, id):
        """ Deletes a student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found")
        student.delete()
        return respond.ok({"message": "Student deleted successfully"})


@std.route('/mentors/all/', strict_slashes=False)
class StudentMentors(Resource):
    @jwt_required()
    @std.expect(auth_parser)
    def get(self):
        """ Retrieves all mentors of this student """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", username=current_user.username)
        if student is None:
            return respond.not_found("Not found")
        mentors = student.mentors
        return respond.ok({"mentors": [mentor.to_dict()
                                        for mentor in mentors]})

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a mentor to a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found")
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found")
        student.mentors.append(mentor)
        student.save()
        return respond.ok({})


@std.route('/mentors/favorites/', strict_slashes=False)
class FavoriteMentors(Resource):
    @std.expect(auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all favorite mentors """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found")
        mentors = student.favorite_mentors
        return respond.ok({"mentors": [mentor.to_dict()
                                        for mentor in mentors]})

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a favorite mentor to a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found")
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found")
        student.favorite_mentors.append(mentor)
        student.save()
        return make_response(jsonify({}), 200)

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def delete(self):
        """ Removes a favorite mentor from a student """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized")
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found")
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found")
        student.favorite_mentors.remove(mentor)
        student.save()
        return respond.ok({})
