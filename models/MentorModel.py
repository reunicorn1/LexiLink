#!/usr/bin/python3
'''Module defines `MentorModel` class'''

from models.UserModel import UserModel
from models.BaseModel import Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Numeric, Enum


choices = ('Community', 'Professional')
@store(
        'students',
        expertise=(Column(String(255), nullable=False), ''),
        bio=(Column(String(255), nullable=True), ''),
        type=(Column(Enum(*choices), nullable=False, default='Community'),
                'Community'),
        price_per_hour=(Column(Numeric(precision=10, scale=2) , nullable=True,
            default=0), 0),
        availability=(Column(String(255), nullable=True), ''),
        demo_video=(Column(String(255), nullable=True), ''),
        students=(relationship('StudentModel', backref='mentors',
                    cascade='all, delete-orphan', lazy='dynamic'), [])
        )
class MentorModel(UserModel, Base):
    '''MentorModel class.

    Atrrs:
        expertise(str):
        bio(str):
        type(str):
        price_per_hour(float):
        availability(str):
        demo_video(str):

    '''
    __tablename__ = 'Mentor_Model'
