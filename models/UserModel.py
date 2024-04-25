#!/usr/bin/python3
'''Module defines `UserModel` class'''

from models.BaseModel import BaseModel, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, text
from flask_login import UserMixin

@store(
        # 'reviews',
        email=(Column(String(128), nullable=False, unique=True), ''),
        password=(Column(String(500), nullable=False), ''),
        username=(Column(String(128), nullable=False, unique=True), ''),
        first_name=(Column(String(128), nullable=False), ''),
        last_name=(Column(String(128), nullable=False), ''),
        country=(Column(String(128), nullable=False), ''),
        nationality=(Column(String(128), nullable=False), ''),
        first_language=(Column(String(128), nullable=False), ''),
        other_languages=(Column(String(128), nullable=True), ''),
        profile_picture=(Column(String(128), nullable=True), ''), # TODO: change to BLOB?
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
        from werkzeug.security import generate_password_hash
        self.password = generate_password_hash(value)

    def verify_password(self, password):
        '''Verify password'''
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password, password)
