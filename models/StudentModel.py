#!/usr/bin/env python3
"""Module defines `StudentModel` class"""

from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey
from models.UserModel import UserModel
from models.BaseModel import Base, store


class StudentFavoriteMentors(Base):
    '''StudentFavoriteMentors class Association Table.
        Relates students to their favorite mentors.
        Atrrs:
        __tablename__(str): table name
        student_id(str): student id (FK)
        mentor_id(str): mentor id (FK)
    '''
    __tablename__ = 'Student_Favorite_Mentors'

    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    mentor_id = Column(String(60), ForeignKey('Mentor_Model.id'),
                       primary_key=True)


@store(
       'favorite_mentors', 'sessions',
       proficiency=(Column(String(255), nullable=False), ''),
       completed_lessons=(Column(Integer, nullable=False, default=0), 0),
       role=(Column(String(10), nullable=False, default='student'),
             'student'),
       favorite_mentors=(relationship('MentorModel',
                                      secondary='Student_Favorite_Mentors',
                                      lazy='dynamic'), []),
       sessions=(relationship('SessionModel',
                              backref='student',
                              lazy='dynamic'), []),
       payments=(relationship('PaymentModel',  backref='student',
                              lazy='dynamic'), []),
       )
class StudentModel(UserModel, Base):
    '''StudentModel class.

    Atrrs:
        __tablename__(str): table name
        proficiency(str): student proficiency
        completed_lessons(int): number of completed lessons (default=0)
        role(str): user role (default='student')
        favorite_mentors(relationship): relationship with `MentorModel`.
                    Student's list of favorite mentors
        sessions(relationship): relationship with `SessionModel`
                    Student's list of sessions
    '''
    __tablename__ = 'Student_Model'
