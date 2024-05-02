#!/usr/bin/python3
'''Module defines `UserModel` class'''
import os
from models.BaseModel import BaseModel, store
from sqlalchemy import Column, String
from flask_login import UserMixin
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash


UPLOAD_FOLDER = 'lexi-app/public/profile_pictures'


@store(
        email=(Column(String(128), nullable=False, unique=True), ''),
        password=(Column(String(500), nullable=False), ''),
        username=(Column(String(128), nullable=False, unique=True), ''),
        first_name=(Column(String(128), nullable=False), ''),
        last_name=(Column(String(128), nullable=False), ''),
        country=(Column(String(128), nullable=False), ''),
        nationality=(Column(String(128), nullable=False), ''),
        first_language=(Column(String(128), nullable=False), ''),
        other_languages=(Column(String(128), nullable=True), ''),
        profile_picture=(Column(String(128), nullable=True), ''),
        )
class UserModel(BaseModel, UserMixin):
    '''User class.

    Atrrs:
        email(str):
        password(str):
        first_name(str):
        last_name(str):
        country(str):
        nationality(str):
        first_language(str):
        other_languages(str):
        profile_picture(str):
    '''
    __tablename__ = 'User_Model'

    @property
    def hashed_password(self):
        '''password getter'''
        return self.password

    @hashed_password.setter
    def hashed_password(self, value):
        '''password setter'''
        self.password = generate_password_hash(value)

    def verify_password(self, password):
        '''Verify password'''
        return check_password_hash(self.password, password)
    
    def save_profile_picture(self, file):
        """save profile picture"""
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            self.profile_picture = filename
            self.save()