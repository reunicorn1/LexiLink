#!/usr/bin/python3
'''Module defines `StudentModel` class'''

from models.UserModel import UserModel
from models.BaseModel import Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey


class StudentFavoriteMentors(Base):
    '''StudentFavoriteMentors class Association Table.'''
    __tablename__ = 'Student_Favorite_Mentors'

    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    mentor_id = Column(String(60), ForeignKey('Mentor_Model.id'),
                        primary_key=True)


@store(
         'favorite_mentors',
        proficiency=(Column(String(255), nullable=False), ''),
        completed_lessons=(Column(Integer, nullable=False, default=0), 0),
        role=(Column(String(10), nullable=False, default='student'), 'student'),
        favorite_mentors=(relationship('MentorModel',
                                       secondary='Student_Favorite_Mentors',
                                       cascade='all',
                                       lazy='dynamic'), [])
        )
class StudentModel(UserModel, Base):
    '''StudentModel class.

    Atrrs:
        proficiency(str):
        completed_lessons(int):
        favorite_mentors(str):
    '''
    __tablename__ = 'Student_Model'
