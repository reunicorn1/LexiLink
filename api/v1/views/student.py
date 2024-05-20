#!/usr/bin/env python3
""" Module for Student related operations
    This module contains the classes and methods for student related operations
    such as profile management, mentor management, etc.
    The classes and methods are implemented as a RESTful API using the Flask
    RESTful framework.
    The module contains the following classes:
    - Profile: Class for managing student profiles
    - Student: Class for managing student data
    - StudentMentors: Class for managing student mentors
    - FavoriteMentors: Class for managing favorite mentors
"""
from flask import request, current_app
from flask_jwt_extended import (
        jwt_required,
        get_jwt_identity,
        get_jwt,
        current_user
)
from flask_login import logout_user
from flask_restx import Resource, Namespace, fields
from models import storage
from api.v1.views.parsers import auth_parser
from api.v1.views.responses import Responses

# Namespace for student related operations
std = Namespace('student', description='Student related operations')
# Responses object
respond = Responses()

# Student Mentor model
student_mentor_model = std.model('StudentMentor', {
    'mentor': fields.String(),
    })

# profile_picture_field = std.parser()
# profile_picture_field.add_argument('profile_picture', location='files', type='file')
# profile_picture_field.add_argument('Authorization', location='headers', required=True)


# Student model
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

delete_model = std.model('DeleteAccount', {
    'refresh_token': fields.String(),
    })



@std.route('/profile', strict_slashes=False)
class Profile(Resource):
    """"" Profile related operations
    This class contains the methods for managing student profiles
    such as retrieving, updating, and deleting a student's profile
        Methods:
        - get: Retrieves a user's profile data
        - put: Updates a user's profile data
        - delete: Deletes a student
    """
    @jwt_required()
    @std.expect(auth_parser)
    def get(self):
        """ Retrieves a user's profile data
        Returns:
            Status code 200: Successful operation, user's profile data
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        if current_user:
            return respond.ok({"profile": current_user.to_dict()})
        return respond.not_found("User not found",
                                 self.__class__.__name__,
                                 current_app.logger)

    @std.expect(auth_parser, student_model)
    @jwt_required()
    def put(self):
        """ Updates a user's profile data
        Returns:
            Status code 200: Successful operation, updated user's profile data
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        if current_user:
            data = request.get_json()
            current_user.update(**data)
            current_app.logger.info(f"User {current_user.id} updated profile")
            return respond.ok({
                "profile": current_user.to_dict()})
        return respond.not_found('User not found',
                                 self.__class__.__name__,
                                 current_app.logger)

    @jwt_required()
    @std.expect(auth_parser, delete_model)
    def delete(self):
        """ Deletes a student
        Returns:
            Status code 200: Successful operation, student deleted successfully
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel",
                                    username=current_user.username)
        if student is None:
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
            current_app.logger.info(f"User {current_user.id} deleted account")
            student.delete()
            return respond.ok({'status': 'success', 'message': 'Student deleted successfully'})
        except Exception as e:
            return respond.internal_server_error(str(e),
                                                 self.__class__.__name__,
                                                 current_app.logger)




@std.route('/<id>', strict_slashes=False)
class Student(Resource):
    """ Student related operations. Retrieves, updates, and deletes a student
            based on the student id
        Methods:
        - get: Retrieves a student by id
        - put: Updates a student
        - delete: Deletes a student
    """
    def get(self, id):
        """ Retrieves a student by id
        Args:
            id (str): The student id
        """
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        return respond.ok({
            "student": student.to_dict()})

    @std.expect(auth_parser, student_model)
    @jwt_required()
    def put(self, id):
        """ Updates a student
        Args:
            id (str): The student id
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        data = request.get_json()
        student.update(**data)
        return respond.ok({
            "student": student.to_dict()})

    @std.expect(auth_parser)
    @jwt_required()
    def delete(self, id):
        """ Deletes a student
        Args:
            id (str): The student id
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", id=id)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        current_app.logger.info(f"Student {student.id} deleted")
        student.delete()
        return respond.ok({"message": "Student deleted successfully"})


@std.route('/mentors/all/', strict_slashes=False)
class StudentMentors(Resource):
    """ Student mentors related operations. Retrieves all mentors of a student
        and adds a mentor to a student
        Methods:
        - get: Retrieves all mentors of a student
        - post: Adds a mentor to a student
    """
    @jwt_required()
    @std.expect(auth_parser)
    def get(self):
        """ Retrieves all mentors of this student
            Returns:
               Status code 200: Successful operation, list of student's mentors
                Status code 401: Unauthorized
                Status code 404: Not found
        """
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", username=current_user.username)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        mentors = student.mentors
        return respond.ok({"mentors": [mentor.to_dict()
                                        for mentor in mentors]})

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a mentor to a student
            Returns:
                Status code 200: Successful operation, mentor added to student
                Status code 401: Unauthorized
                Status code 404: Not found
        """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        student.mentors.append(mentor)
        student.save()
        return respond.ok({"message": "Mentor added successfully"})


@std.route('/mentors/favorites/', strict_slashes=False)
class FavoriteMentors(Resource):
    @std.expect(auth_parser)
    @jwt_required()
    def get(self):
        """ Retrieves all favorite mentors
        Returns:
            Status code 200: Successful operation, list of favorite mentors
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        mentors = student.favorite_mentors
        return respond.ok({"mentors": [mentor.to_dict()
                                        for mentor in mentors]})

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def post(self):
        """ Adds a favorite mentor to a student
        Returns:
            Status code 200: Successful operation, favorite mentor added
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        student.favorite_mentors.append(mentor)
        student.save()
        return respond.ok({"message":
                            "Favorite mentor added successfully"
                            })

    @std.expect(auth_parser, student_mentor_model)
    @jwt_required()
    def delete(self):
        """ Removes a favorite mentor from a student
        Returns:
            Status code 200: Successful operation, favorite mentor removed
            Status code 401: Unauthorized
            Status code 404: Not found
        """
        username = get_jwt_identity()
        claims = get_jwt()
        if claims['user_type'] != 'student':
            return respond.unauthorized("Unauthorized",
                                        self.__class__.__name__,
                                        current_app.logger)
        student = storage.find_by("StudentModel", username=username)
        if student is None:
            return respond.not_found("Not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        data = request.get_json()
        mentor = storage.find_by("MentorModel", username=data.get('mentor'))
        if mentor is None:
            return respond.not_found("Mentor not found",
                                     self.__class__.__name__,
                                     current_app.logger)
        student.favorite_mentors.remove(mentor)
        student.save()
        return respond.ok({"message": "Favorite mentor removed successfully"})
