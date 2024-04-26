#!/usr/bin/python3
'''Module defines `MentorModel` class'''

from models.UserModel import UserModel
from models.BaseModel import Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Numeric, Enum, ForeignKey


class StudentMentors(Base):
    '''StudentFavoriteMentors class Association Table.'''
    __tablename__ = 'Student_Mentors'
    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    mentor_id = Column(String(60), ForeignKey('Mentor_Model.id'),
                       primary_key=True)


choices = ('Community', 'Professional')


@store(
        'students',
        expertise=(Column(String(255), nullable=False), ''),
        bio=(Column(String(255), nullable=True), ''),
        type=(Column(Enum(*choices), nullable=False, default='Community'),
              'Community'),
        price_per_hour=(Column(Numeric(precision=10, scale=2), nullable=True,
                        default=0), 0),
        availability=(Column(String(255), nullable=True), ''),
        demo_video=(Column(String(255), nullable=True), ''),
        role=(Column(String(10), nullable=False, default='mentor'), 'mentor'),
        students=(relationship('StudentModel',
                  secondary='Student_Mentors',
                  cascade='all',
                  backref='mentors',
                  lazy='dynamic'), [])
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
